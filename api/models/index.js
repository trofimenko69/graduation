import {Sequelize} from "sequelize";
import Agreement from './agreement.js'
import User from './user.js'
import Company from './company.js'
import Subscription from "./subscription.js";
import Coach from "./coach.js";
import Mark from "./mark.js";
import History from './history.js'
import Workout from "./workout.js";
const { DB_USER, DB_PWD, DB_HOST, DB_PORT } = process.env;

export const models={
    User,Company, Subscription, Coach, Agreement, Mark, History, Workout
};

export const sequelize = new Sequelize(process.env.DB_NAME, DB_USER, DB_PWD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    dialectOptions: { multipleStatements: true },
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        timestamps: true,
        underscored: true,
    },
    logging: false,
});