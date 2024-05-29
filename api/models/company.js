import {Model, DataTypes} from "sequelize";
import {v4 as uuidv4} from "uuid";
import argon2 from "argon2";


export default class Company extends Model{
    static initialize(sequelize) {
        Company.init(
            {
                id: {type: DataTypes.UUID, primaryKey: true},

                login: {
                    type: DataTypes.STRING,
                    validate: {isEmail: {msg: 'Must be a valid email address'}},
                    allowNull: false,
                    unique: 'login',
                },

                password: {type: DataTypes.STRING, allowNull: true},

                name: DataTypes.STRING,
                description: DataTypes.TEXT,
                logo: DataTypes.BOOLEAN,

                address: DataTypes.STRING,
                area: DataTypes.STRING,
                size: DataTypes.SMALLINT,

                phone: DataTypes.STRING,
                inn: DataTypes.STRING,
                kpp: DataTypes.STRING,


            },
            {
                sequelize,
                modelName: 'Company',
                tableName: 'companies',
                paranoid: true,
            }
        );

        Company.beforeCreate(c => {
            c.id = uuidv4();
        });

    }
    async validatePassword(password) {
        return await argon2.verify(this.password, password);
    }

}