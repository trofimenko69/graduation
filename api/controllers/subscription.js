import {AppErrorInvalid, AppErrorMissing, AppErrorNotExist} from "../utils/errors.js";
import Subscription from "../models/subscription.js";
import Agreement from "../models/agreement.js";
import Company from "../models/company.js";
import History from "../models/history.js";
import states from "../config/states.json" assert { type: "json" };

export default {
    async design({ body: {
        subscriptionId,
        companyId,
        coachId
    }, user }, res){


        if(!subscriptionId) throw new AppErrorMissing('subscriptionId')
        if (!companyId) throw new AppErrorMissing('companyId');

        const company= await Company.findByPk(companyId)

        if (!company) throw new AppErrorNotExist('company');

        const agreement=await Agreement.create({
            subscriptionId: subscriptionId,
            companyId:companyId,
            coachId: company ?? null,
        })

        await History.create({
            type: 'assign',
            date: new Date(),
            userId: user.id
        })


        res.json({ agreement })
    },

    async freeze({params: { subscriptionId }, user }, res){
        const agreement= await Agreement.findOne({
            where: {
                subscriptionId: subscriptionId,
            },
            include:{
                model: Subscription,
                as: 'subscription',
                required:true,
            }
        })

        if(!agreement) throw new AppErrorNotExist('subscription')

        if(agreement.status !== states.ACTIVE) throw new AppErrorInvalid('subscription')

        if(
            (agreement.subscription.visitingTime === 'Безлимит'
                &&  agreement.createdAt + agreement.subscription.countVisits > new Date())  || agreement.subscription.visitingTime > 0 ) {
            await agreement.update({ states: states.BLOCKED })
        } else throw new AppErrorInvalid('subscription')

        res.json({status: 'Ok'})
    },

    async defrost({params: { subscriptionId }, user}, res){
        const agreement=await Agreement.findOne({
            where: {
                subscriptionId: subscriptionId,
                userId: user.id,
                states: states.BLOCKED,
            }
        })

        if(!agreement) throw new AppErrorNotExist('subscription')

        await agreement.update({ states: states.ACTIVE });
        res.json({ status: 'Ok' })

    }
}