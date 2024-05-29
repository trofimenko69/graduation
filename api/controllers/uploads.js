import path from 'path';
import multer from 'multer';
import { AppError, AppErrorMissing } from '../utils/errors.js';
import errorCodes from '../config/errorCodes.json' assert { type: "json" }

import fs from 'fs';

const acceptedTypes = /jpeg|jpg|png|pdf/;


// Проверка расширения файла
const fileFilter = (req, { originalname }, cb) => {
    const extension = path.extname(originalname).toLowerCase();
    if (acceptedTypes.test(extension)) cb(null, true);
    else cb(new AppError(errorCodes.FileExtensionNotAllowed));
};


const storage = multer.diskStorage({
    destination: (req, { originalname }, cb) => {
        const extension = path.extname(originalname).toLowerCase();
        cb(null, `./uploads/images/`);
    },
    filename: ({ user }, { originalname }, cb) => {
        const extension = path.extname(originalname).toLowerCase();
        cb(null, user.id + (extension === '.pdf' ? '.pdf' : '.jpg'));
    },
});


const uploader = multer({ storage, fileFilter, limits: { fileSize: 3145728 } }).single('file');


export default {
    uploader,

    async afterUpload({ file, user }, res) {
        if (!file) throw new AppErrorMissing('file');
        const extension = path.extname(file.originalname).toLowerCase();

        await user.update(extension === '.pdf' ? { summary: true } : { logo: true });
        res.json({ status: 'OK' });
    },

    

    async delete({ user }, res) {
        fs.unlink(`./uploads/summary/${user.id}.pdf`, () => {});

        await user.update({ summary: false });
        res.json({ status: 'OK' });
    },

};