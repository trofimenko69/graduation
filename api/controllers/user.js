import {AppErrorForbiddenAction, AppErrorMissing, AppErrorNotExist} from "../utils/errors.js";
import Subscription from "../models/subscription.js";
import Agreement from "../models/agreement.js";


export default {
    async self({  user }, res){
        if(!user) throw new AppErrorForbiddenAction('user')
        user.subscription=await Subscription.findAll({
            where: { userId: user.id,  isActive: true }
        })
        res.json({
            user: user
        })
    },
}