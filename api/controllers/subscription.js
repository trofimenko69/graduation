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

export default {
    async design({
                     body: {
                         subscriptionId,
                         companyId,
                         coachId
                     }, user
                 }, res) {


        if (!subscriptionId) throw new AppErrorMissing('subscriptionId')
        if (!companyId) throw new AppErrorMissing('companyId');

        const company = await Company.findByPk(companyId)
        const subscription = await Subscription.findByPk(companyId)

        if (!company) throw new AppErrorNotExist('company');
        if (!subscription) throw new AppErrorNotExist('subscription');

        const agreement = await Agreement.create({
            subscriptionId: subscriptionId,
            companyId: companyId,
            coachId: coachId ?? null,
        })

        await History.create({
            type: 'assign',
            date: new Date(),
            userId: user.id
        })


        res.json({agreement})
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


    async create({body: {countVisits, timeStart, timeEnd, coast, isUnlimited, type}, company}, res) {
        const checkSubscription = await Subscription.findOne({
            where: {
                countVisits,
                timeStart,
                timeEnd,
                isUnlimited,
                type,
            }
        })
        if (checkSubscription) throw new AppErrorAlreadyExists('subscription')
        const subscription = await Subscription.create({
            countVisits,
            timeStart,
            timeEnd,
            coast,
            isUnlimited,
            type,
        })

        await cache.set(company.id, null)

        res.json(subscription)
    },

    async update(
     {
     params: {subscriptionId},
     body: { countVisits, timeStart, timeEnd, coast, isUnlimited, type },
     },
     res){

        const subscription=await Subscription.findByPk(subscriptionId)
        const checkSubscription =await Subscription.findOne({
            where: {
                countVisits,
                timeStart,
                timeEnd,
                coast,
                isUnlimited,
                type
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

        const companyId= await Company.findAll({
            where: {
                subscriptionId: subscription.id,
            },
            attributes: ['id'],
        })

        if(companyId) throw new AppErrorNotExist('companyId')

        await cache.set(companyId, null)

        res.json({states: 'Ok'})
    }
}