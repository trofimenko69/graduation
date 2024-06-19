import {
    AppErrorAlreadyExists,
    AppErrorDuplicate,
    AppErrorInvalid,
    AppErrorMissing,
    AppErrorNotExist
} from "../utils/errors.js";
import Subscription from "../models/subscription.js";
import Agreement from "../models/agreement.js";
import cache from "../service/cache.js";
import Company from "../models/company.js";
import History from "../models/history.js";
import states from "../config/states.json" assert { type: "json" };
import types from "../config/types.json" assert { type: "json" };

export default {
    async design({
                     body: {
                         subscriptionId,
                         coachId
                     }, user
                 }, res) {


        if (!subscriptionId) throw new AppErrorMissing('subscriptionId')


        const subscription = await Subscription.findByPk(subscriptionId)
        if (!subscription) throw new AppErrorNotExist('subscription');
        const agreement= await Agreement.findOne({
            where: {
                subscriptionId: subscription.id
            }
        })
        if(agreement) throw new AppErrorAlreadyExists('agreement')
        if(subscription.type===types.GROUP && coachId===null) throw new AppErrorInvalid('subscription')
        const company = await Company.findOne({
            where: {
                id: subscription.companyId
            }
        })
        if(!company) throw new AppErrorNotExist('company')
        await Agreement.create({
            subscriptionId: subscriptionId,
            companyId: company.id,
            userId: user.id,
            coachId: coachId ?? null,
        })

        await History.create({
            type: 'assign',
            date: new Date(),
            userId: user.id
        })


        res.json({status: 'Ok'})
    },

    async freeze({params: {subscriptionId}, user}, res) {
        const agreement = await Agreement.findOne({
            where: {
                subscriptionId: subscriptionId,
            },
            include: {
                model: Subscription,
                as: 'subscription',
                required: true,
            }
        })

        if (!agreement) throw new AppErrorNotExist('subscription')

        if (agreement.status !== states.ACTIVE) throw new AppErrorInvalid('subscription')

        if (
            (agreement.subscription.isUnlimited
                && agreement.createdAt + agreement.subscription.countVisits > new Date()) || agreement.subscription.visitingTime > 0) {
            await agreement.update({states: states.BLOCKED})
        } else throw new AppErrorInvalid('subscription')

        res.json({status: 'Ok'})
    },

    async defrost({params: {subscriptionId}, user}, res) {
        const agreement = await Agreement.findOne({
            where: {
                subscriptionId: subscriptionId,
                userId: user.id,
                states: states.BLOCKED,
            }
        })

        if (!agreement) throw new AppErrorNotExist('subscription')

        await agreement.update({states: states.ACTIVE});
        res.json({status: 'Ok'})

    },


    async create({body: { countVisits, timeStart, timeEnd, coast, isUnlimited, type }, company}, res) {

        if(!countVisits) throw  new AppErrorMissing('countVisits')
        if(!coast) throw new AppErrorMissing('coast')
        if(!isUnlimited) throw new AppErrorMissing('isUnlimited')

        const checkSubscription = await Subscription.findOne({
            where: {
                 countVisits,
                 timeStart: timeStart ?? null,
                 timeEnd: timeEnd ?? null,
                 isUnlimited,
                 coast,
                 type: type ?? types.ORDINARY,
                 companyId: company.id,
            }
        })

        if (checkSubscription) throw new AppErrorAlreadyExists('subscription')
        const subscription = await Subscription.create({
            countVisits,
            timeStart: timeStart ?? null,
            timeEnd: timeEnd ?? null,
            isUnlimited,
            coast,
            type: type ?? types.ORDINARY,
            companyId: company.id,
        })

        await cache.del(company.id)

        res.json(subscription)
    },

    async update(
     {
     params: {subscriptionId},
     body: { countVisits, timeStart, timeEnd, coast, isUnlimited, type }, company,
     },
     res){

        if(!countVisits) throw  new AppErrorMissing('countVisits')
        if(!coast) throw new AppErrorMissing('coast')
        if(!isUnlimited) throw new AppErrorMissing('isUnlimited')

        const subscription=await Subscription.findByPk(subscriptionId)
        const checkSubscription = await Subscription.findOne({
            where: {
                countVisits,
                timeStart: timeStart ?? null,
                timeEnd: timeEnd ?? null,
                isUnlimited,
                coast,
                type: type ?? types.ORDINARY,
                companyId: company.id,
            }
        })

        if(!subscription) throw new AppErrorNotExist('subscription')
        if (checkSubscription) throw  new AppErrorDuplicate('subscription')

        await subscription.update({
            countVisits,
            timeStart,
            timeEnd,
            coast,
            isUnlimited,
            type
        })

        await cache.del(company.id)

        res.json({ states: 'Ok' })
    }
}