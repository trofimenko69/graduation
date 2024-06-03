import {DataTypes, Model} from "sequelize";
import {v4 as uuidv4} from "uuid";
import types from "../config/types.json";

export default class Subscription extends Model {
    static initialize(sequelize){
        Subscription.init({

                id: {type: DataTypes.UUID, primaryKey: true},
                countVisits: {type : DataTypes.SMALLINT, allowNull: false},
                timeStart: { type: DataTypes.TIME, allowNull: true },
                timeEnd: {type: DataTypes.TIME, allowNull: true},
                coast: { type: DataTypes.SMALLINT },
                visitingTime: { type: DataTypes.STRING, allowNull: false },
                type: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    validate: { isIn: [Object.values(types)] },
                },
        },
            {
                sequelize,
                modelName: 'Subscription',
                tableName: 'subscriptions',
                paranoid: true,
            }
        );

        Subscription.beforeCreate(s => {
            s.id = uuidv4();
        });
    }


}