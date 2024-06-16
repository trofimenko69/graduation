import path from 'path';
import multer from 'multer';
import { AppError, AppErrorMissing } from '../utils/errors.js';
import errorCodes from '../config/errorCodes.json' assert { type: "json" }

import fs from 'fs';
import User from "../models/user.js";

const acceptedTypes = /jpeg|jpg|png|pdf/;


// Проверка расширения файла
const fileFilter = (req, { originalname }, cb) => {
    const extension = path.extname(originalname).toLowerCase();
    if (acceptedTypes.test(extension)) cb(null, true);
    else cb(new AppError(errorCodes.FileExtensionNotAllowed));
};


const storageLogo = multer.diskStorage({
    destination: ({user, company, }, { originalname }, cb) => {
         if(user) {
             console.log(1)
             cb(null, `./uploads/users/`);
         }
         else cb(null, `./uploads/company/logo`)
    },
    filename: ({ user, company }, { originalname }, cb) => {
        const extension = path.extname(originalname).toLowerCase();
        if(user) cb(null, user.id + extension);
        else cb(null, company.id + extension)
    },
});

const uploaderLogo = multer({ storageLogo, fileFilter, limits: { fileSize: 3145728 } }).single('file',  1);


const storageImages = multer.diskStorage({
    destination: ({ company }, { originalname }, cb) => {
        if(company) cb(null, `./uploads/company/images`)
    },
    filename: ({ user, company }, { originalname }, cb) => {
        const extension = path.extname(originalname).toLowerCase();
        if(company) cb(null, company.id + extension);
    },
})

const uploaderImages = multer({ storageImages, fileFilter, limits: { fileSize: 3145728 } }).any();


export default {
    uploaderLogo,
    uploaderImages,

    async afterUploadLogo({ file, user, company }, res) {

        if (!file) throw new AppErrorMissing('file');
        if(user) await User.update( { logo: true },{where: {id : user.id}} );
        else await company.update({ logo: true} )

        res.json({ status: 'OK' });
    },

    async afterUploadImages({ images }, res){

        const infoAboutImages=images.map((image, index)=>{
                return {
                    id: index,
                    name: image.fileName,
                    path: `/${image.path}`,
                    size: image.size
                }
        })
        res.json({info: infoAboutImages.map(m=>m)})
    },
    async delete({ user }, res) {
        fs.unlink(`./uploads/summary/${user.id}.pdf`, () => {});

        await user.update({ summary: false });
        res.json({ status: 'OK' });
    },

};