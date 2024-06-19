import { CronJob } from 'cron';
import Subscription from "../models/subscription.js";
import Agreement from "../models/agreement.js";
import User from "../models/user.js";
import sendEmail from '../service/email.js'
import Company from "../models/company.js";
import states from "../config/states.json" assert { type: "json" };

export default {
    reminderSubscription: new CronJob('59 23 * * *', async () => {
        console.log('Cron start reminder subscription');

        const subscriptions=await Subscription.findAll({
            where:{
                 countVisits: 2,
            },
            include:
                {
                    model: Agreement, as: 'agreements', required: true,
                    where: {
                        states: states.ACTIVE,
                    },
                    include: [
                        { model: Company, as: 'company', required: true },
                        { model: User, as: 'user', required: true }]
                },
        })


        for (const subscription of subscriptions.filter(s => !s.user.length)) {
            sendEmail(subscription.agreements[1].user.login, 'reminderSubscription', subscription.agreements[0].company.name);
        }

        console.log('Cron end reminder subscription');
    }),


}