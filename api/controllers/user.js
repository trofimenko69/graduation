import {AppErrorInvalid, AppErrorMissing} from "../utils/errors.js";
import Subscription from "../models/subscription.js";
import Agreement from "../models/agreement.js";
import User from "../models/user.js";
import History from "../models/history.js";


export default {
    async self({  user }, res){
        user=await User.findByPk(user.id)
       const [subscription, history]=  await Promise.all([
               Agreement.findAll({ where: { userId: user.id },
            include: {
                model: Subscription,
                as: 'subscription',
                required: true,
            }
        }),
           History.findAll({where: { userId: user.id } }
           )])

        res.json({
            user: user,
            agreements: subscription.map(s=>s),
            history: history,
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