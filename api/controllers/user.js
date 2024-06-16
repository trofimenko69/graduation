import {AppErrorForbiddenAction, AppErrorInvalid, AppErrorMissing, AppErrorNotExist} from "../utils/errors.js";
import Subscription from "../models/subscription.js";
import Agreement from "../models/agreement.js";
import User from "../models/user.js";
import states from "../config/states.json" assert { type: "json" };


export default {
    async self({  user }, res){
        user.subscription=await Agreement.findAll({
            where: { userId: user.id },
            include: {
                model: Subscription,
                as: 'subscription',
                required: true,
            }
        })

        res.json({
            user: user,
            agreements: user.subscription.map(s=>s)
        })
    },

    async update({ body: { fio, phone, date }, user}, res){
        if(!fio) throw new AppErrorMissing('fio')
        if(!phone) throw new AppErrorMissing('phone')
        if(!date) throw new AppErrorMissing('date')
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