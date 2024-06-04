import express from 'express'
import cookieParser from 'cookie-parser'
import cronService from './service/cron.js'
import {initDbModels} from "./utils/db.js";
import {initCache} from "./service/cache.js";
import { AppError, MultipleError, SystemError } from './utils/errors.js';
import { MulterError } from 'multer';

import corsMiddleware from './middlewares/cors.js';
import authRoute from './routes/auth.js'
import userRoute from './routes/user.js'
import companyRoute from  './routes/company.js'
import coachRoute from './routes/coach.js'
import systemRoute from './routes/system.js'
import uploadsRoute from './routes/uploads.js'
import subscriptionsRoute from './routes/subscription.js'
import  dotenv from 'dotenv'
dotenv.config({path: '../.env'})

const app=express();


(async function initDb(){
    try {
        await initCache();
        await initDbModels();
    } catch (e) {
        if (app.get('env') !== 'test') {
            console.log(e)
            console.log('COULD NOT CONNECT TO THE DB, retrying in 5 seconds')
        }
        setTimeout(initDb, 5000)
    }
})();


app.use(corsMiddleware)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/auth', authRoute)
app.use('/companies', companyRoute)
app.use('/users', userRoute)
app.use('/coaches', coachRoute)
app.use('/system', systemRoute)
app.use('/subscription', subscriptionsRoute)
app.use('/uploads', express.static('./uploads'), uploadsRoute);

app
    .use((req, res) => res.status(404).json({ type: 'NOT FOUND', code: 404 }))
    .use((error, req, res, next) => {
        console.error(error);

        if (error instanceof AppError || error instanceof SystemError || error instanceof MultipleError) {
            res.status(error.status).json(error.toJSON());
        } else if (error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE') {
            const error = new AppError(errorCodes.FileTooLarge);
            res.status(error.status).json(error.toJSON());
        } else if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else if (error) {
            res.status(500).json(error);
        } else {
            res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
        }
    });

if (app.get('env') === 'production') {
    await cronService.reminderSubscription.start();
}

app.listen(process.env.PORT || 3000, ()=> console.log(`Listen on : localhost ${process.env.PORT || 3000}`))
