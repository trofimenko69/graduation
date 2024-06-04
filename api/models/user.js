import {Model,DataTypes } from "sequelize";
import argon2 from "argon2";
import roles from '../config/roles.json' assert { type: "json" };
import { v4 as uuidv4 } from 'uuid';

export default class User extends Model {
    static initialize(sequelize){
    User.init(
        {
    id: { type: DataTypes.UUID, primaryKey: true },
    login: {
        type: DataTypes.STRING,
        validate: {isEmail: {msg: 'Must be a valid email address'}},
        allowNull: false,
        unique: 'login',
    },
    password: { type: DataTypes.STRING, allowNull: false },
    isActivate: { type: DataTypes.BOOLEAN, defaultValue: false },
    fio: DataTypes.STRING,
    phone: DataTypes.STRING,
    role: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: roles.DEFAULT,
        validate: { isIn: [Object.values(roles)] },
    },
    logo: DataTypes.BOOLEAN,
    date: DataTypes.DATE,
    code: DataTypes.STRING,
    codeAt: DataTypes.DATE,

},
{
    sequelize,
    modelName: 'User',
    tableName: 'users',
    paranoid: true,
    });


    User.beforeCreate(user => {
            user.id = uuidv4();
        });

    }

    async validatePassword(password) {
        return await argon2.verify(this.password, password);
    }
}