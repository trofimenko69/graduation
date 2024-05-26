import {AppErrorAlreadyExists, AppErrorInvalid, AppErrorMissing, AppErrorNotExist} from "../utils/errors.js";
import User from "../models/user.js";
import jwt from "../utils/jwt.js";
import validate from 'validator'
import sendEmail from '../service/email.js'
import generate from "../utils/generate.js";
import argon2 from "argon2";

const atLeastOneDigit = /\d/,
    atLeastOneLowerLetter = /[a-z]/,
    atLeastOneUpperLetter = /[A-Z]/,
    atLeastOneSpecial = /[!@_#$%^&*]/,
    otherChars = /[^0-9a-zA-Z!@_#$%^&*]/g;

export default  {
    async registration({body: {login, code , password, fio} }, res ){

        if (!login) throw new AppErrorMissing('email');
        if (!code) throw new AppErrorMissing('code');
        if(!fio) throw new AppErrorMissing('fio')
        if(!password) throw new AppErrorMissing('password')
        const user=await User.findOne({where: { login }})


        if (user?.code !== code || new Date() - user.codeAt > 1000 * 60 * 15) throw new AppErrorInvalid('code');

        await user.update({
            isActivate: true
        })


        res.json({status: 'Ok'})
    },

    async  checkEmail({ body: {login, password, fio} }, res){

        if(!login || !validate.isEmail(login)) throw new AppErrorInvalid('login')

        const isValid =
            atLeastOneDigit.test(password) &&
            atLeastOneLowerLetter.test(password) &&
            atLeastOneUpperLetter.test(password) &&
            atLeastOneSpecial.test(password) &&
            !otherChars.test(password) &&
            password.length >= 8 &&
            password.length <= 20;

        if(!password) throw new AppErrorInvalid('password')
        if(!fio) throw new AppErrorMissing('fio')

        const user=await User.findOne({
            where: { login }
        })
        if(user) throw new AppErrorAlreadyExists('user')
        const code = generate(6)
        sendEmail(login, 'activateEmail', code)
        await User.create({ login, password: await argon2.hash(password), fio, code, codeAt: new Date() })
        res.json({ status: 'OK' });

    },


    async login({body: {login, password} }, res){
        if (!login) throw new AppErrorNotExist('login');
        if (!password) throw new AppErrorNotExist('password');
        const user=await User.findOne({
            where: { login }
        })
        if(!await user.validatePassword(password)) throw new AppErrorInvalid('password')
        const { jwt: token } = jwt.generate({ id: user.id });

        res.json({user: user, token})
    },

    async resetPassword({}, res){

    },


}