import { CronJob } from 'cron';
import Subscription from "../models/subscription.js";
import {Op} from "sequelize";
import Agreement from "../models/agreement.js";
import User from "../models/user.js";
import sendEmail from '../service/email.js'
import Company from "../models/company.js";


export default {
    reminderSubscription: new CronJob('59 23 * * *', async () => {
        console.log('Cron start reminder subscription');

        const subscriptions=await Subscription.findAll({
            where:{
                [Op.or]: [
                    {
                        [Op.and]: [
                            { endDate: new Date().setDate(new Date().getDay() + 3) },
                            { visitingTime: 'Безлимит' }
                        ]
                    },
                    {  numberVisits: 2 },
                ],
                isActive: true,
            },
            include:[
                {
                    model: Agreement, as: 'agreements', required: true,
                    include: { model: Company, as: 'company', required: true }
                },
                { model: User, as: 'user', required: true }
            ],
        })


        for (const subscription of subscriptions.filter(s => !s.user.length)) {
            sendEmail(subscription.user.login, 'reminderSubscription', subscription.agreements[0].company.name);
        }

        console.log('Cron end reminder subscription');
    }),


}