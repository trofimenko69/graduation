import { AppErrorMissing, AppErrorNotExist} from "../utils/errors.js";
import Subscription from "../models/subscription.js";
import Agreement from "../models/agreement.js";
import Company from "../models/company.js";


export default {
    async design({ body: {
        visitingTime,
        numberVisits,
        coast,
        companyId
    }, user }, res){

        if(!visitingTime) throw new AppErrorMissing('visitingTime')
        if(!numberVisits) throw new AppErrorMissing('numberVisits')
        if(!coast) throw new AppErrorMissing('coast')
        if (!companyId) throw new AppErrorMissing('companyId');

        const company= await Company.findByPk(companyId)

        if (!company) throw new AppErrorNotExist('company');

        const checkAgreement= await Agreement.findOne({
            where: {
            companyId: company.id,
            userId: user.id
            }}
        )

        let agreement ;
        if(!checkAgreement){
            if(!user.passport) throw new AppErrorMissing('passport')
            agreement=await Agreement.create({
                companyId: company.id,
                userId: user.id
            })
        }

       const subscription=await Subscription.create({
            numberVisits,
            beginDate: new Date(),
            endDate:  visitingTime === 'Безлимит' ? new Date(new Date().getDate() + numberVisits) : null,
            coast,
            visitingTime,
            isActive:true,
            userId: user.id,
            agreementId: checkAgreement? checkAgreement.id : agreement.id
        })

        await Agreement.update({
            subscriptionId: subscription.id,
        },
            { where: { id: subscription.agreementId }})

        res.json({ status: 'Ok'})
    },

    async freeze({params: { subscriptionId }, user }, res){
        const subscription= await Subscription.findOne({
            where: {
                id: subscriptionId,
                userId: user.id,
                isActive: true,
            }
        })

        if(!subscription) throw new AppErrorNotExist('subscription')

        if(
            subscription.visitingTime === 'Безлимит' &&
            subscription.endDate > new Date()
        ) {
            await subscription.update({ isActive: false })
            return res.json({status: 'Ok'})
        }

        if(subscription.numberVisits > 0) await subscription.update({ isActive: false })
        res.json({status: 'Ok'})
    },

    async defrost({params: { subscriptionId }, user}, res){
        const subscription=await Subscription.findOne({
            where: {
                id: subscriptionId,
                userId: user.id,
                isActive: false,
            }
        })

        if(!subscription) throw new AppErrorNotExist('subscription')

        await subscription.update({ isActive: true });
        res.json({ status: 'Ok' })

    }
}