import {AppErrorForbiddenAction, AppErrorInvalid, AppErrorMissing, AppErrorNotExist} from "../utils/errors.js";
import Subscription from "../models/subscription.js";
import Agreement from "../models/agreement.js";
import User from "../models/user.js";


export default {
    async self({  user }, res){
        console.log(user)
        if(!user) throw new AppErrorForbiddenAction('user')
        user.subscription=await Subscription.findAll({
            where: { userId: user.id,  isActive: true }
        })

        console.log(user)
        res.json({
            user: user,
            subscriptions: user.subscription.map(s=>s)
        })
    },

    async update({ body: { fio, phone, date }, user}, res){
        const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
        const [, day, month, year] = date.match(regex);
        if(date && (day>31 || month>12 || year<1950 || day<1 || month<1 || year>2024)) throw new AppErrorInvalid('date')
        const dateFromRegex = new Date(year, month - 1, day);

        await User.update({fio, phone, dateFromRegex}, {
            where:{
                id: user.id
            }
        })
        res.json({status: 'Ok'})
    }
}