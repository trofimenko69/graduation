import nodemailer from 'nodemailer'
import {SystemError} from "../utils/errors.js";
import emailTemplates from "../config/email-templates.js";
const address=process.env.EMAIL_ADDRESS

const transporter = nodemailer.createTransport({
    service: 'smtp.gmail.com',
    port: 587,
    secure:false,
    auth: {
        user: address, pass: 'tidtid2003'
    },
});

export default function (to, type, ...arg){

    if (!to) return;
    if (!type) throw new SystemError(500, 'type not specified');

    const replacement = emailTemplates[type];
    if (!replacement) throw new SystemError(500, 'not exist');


    const mail = {
        from: { name: 'Practice Service', address },
        to,
        subject: replacement.subject,
        generateTextFromHTML: true,
        html: `${replacement.template(
            ...arg
        )}<br><p>Это автоматически сгенерированное сообщение. Не отвечайте на него.</p>`,
    };

    // отправка сообщений на production
    if (process.env.NODE_ENV === 'production') {
        transporter.sendMail(mail);
    } else {
        console.log(mail);
    }
}