import express from 'express'
import logger from "morgan";
import cookieParser from 'cookie-parser'
import cronService from 'service/cron.js'
import {initDbModels} from "./utils/db.js";
import authRoute from './routes/auth.js'
import  dotenv from 'dotenv'
dotenv.config({path: '../.env'})

const app=express()

logger.token('body', req => {
    try {
        if (req.method === 'POST' || req.method === 'PUT') {
            return JSON.stringify(req.body);
        } else {
            return null;
        }
    } catch (e) {
        return `Body parse error ${e?.message ?? e}`;
    }
});

/*if (app.get('env') === 'production') {
    app.use(
        logger('[:date[clf]] :method :url :status :response-time ms', {
            skip: req => ['/system', '/uploads'].includes(req.baseUrl),
        })
    );
} else if (app.get('env') === 'development' || app.get('env') === 'staging') {
    app.use(
        logger('[:date[clf]] :method :url :status :body :response-time ms', {
            skip: req => ['/system', '/uploads'].includes(req.baseUrl),
        })
    );
}*/


(async function initDb(){
    try {
       // await initCache();
        await initDbModels();
        await cronService.reminderSubscription();
        console.log(1)
    } catch (e) {
        if (app.get('env') !== 'test') {
            console.log(e)
            console.log('COULD NOT CONNECT TO THE DB, retrying in 5 seconds')
        }
        setTimeout(initDb, 5000)
    }
})();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', authRoute)


app.listen(process.env.PORT || 3000, ()=> console.log(`Listen on : localhost ${process.env.PORT || 3000}`))
