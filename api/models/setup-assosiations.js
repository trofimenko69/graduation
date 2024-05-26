import Company from "./company.js";
import Coach from "./coach.js";
import User from "./user.js";
import Subscription from "./subscription.js";
import Workout from "./workout.js";
import Agreement from "./agreement.js";
import Mark from "./mark.js";
import History from "./history.js";
export default function (){

    Company.hasMany(Coach,{foreignKey: { name :'companyId', allowNull: true}, as: 'coaches'});
    Coach.belongsTo(Company,{foreignKey: { name :'companyId', allowNull: true}, as: 'companies'});

    User.hasMany( Subscription, { foreignKey: {name: 'userId', allowNull: true}, as: 'subscriptions'});
    Subscription.belongsTo(User, {foreignKey: {name: 'userId', allowNull: true}, as: 'user'});

    Company.hasMany(Agreement, {foreignKey: {name: 'companyId', allowNull: true}, as: 'agreements'});
    Agreement.belongsTo(Company, {foreignKey: {name: 'companyId', allowNull: true}, as: 'company'});

    Company.hasMany(Mark, {foreignKey: {name: 'companyId', allowNull: true}, as: 'marks'});
    Mark.belongsTo(Company, {foreignKey: {name: 'companyId', allowNull: true}, as:'company'});

    User.hasMany(Mark, {foreignKey: {name: 'userId', allowNull: true}, as: 'marks'});
    Mark.belongsTo(User, {foreignKey: {name: 'userId', allowNull:true}, as:'user'});

    User.hasMany(Agreement, {foreignKey: {name: 'userId', allowNull: true}, as: 'agreements'});
    Agreement.belongsTo(User, {foreignKey: {name: 'userId', allowNull: true}, as: 'user' });

    Subscription.hasOne(Agreement, {foreignKey: {name: 'subscriptionId', allowNull: true }, as: 'agreements'});
    Agreement.belongsTo(Subscription, {foreignKey: {nam:'subscriptionId', allowNull: true }, as: 'subscription'});

    User.hasMany(History, {foreignKey: {name: 'userId', allowNull: true }, as: 'histories'})
    History.belongsTo(User, {foreignKey: {name: 'userId', allowNull: true }, as: 'user'})

    Coach.hasOne(Agreement, {foreignKey: {name: 'coachId', allowNull: true }, as: 'agreements'});
    Agreement.belongsTo(Subscription, {foreignKey: {nam:'coachId', allowNull: true }, as: 'coach'});

    Coach.hasMany(Workout, {foreignKey: {name: 'coachId', allowNull: false}, as:'workouts'});
    Workout.belongsTo(Coach, {foreignKey: {name: 'coachId', allowNull: false}, as:'coach'});

    Company.hasMany(Workout, {foreignKey: {name: 'companyId', allowNull: false}, as:'workouts'});
    Workout.belongsTo(Company, {foreignKey: {name: 'companyId', allowNull: false}, as:'company'});


}