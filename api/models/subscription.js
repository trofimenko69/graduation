import {DataTypes, Model} from "sequelize";
import {v4 as uuidv4} from "uuid";

export default class Subscription extends Model {
    static initialize(sequelize){
        Subscription.init({

                id: {type: DataTypes.UUID, primaryKey: true},
                numberVisits: {type : DataTypes.SMALLINT, allowNull: false},
                beginDate: { type: DataTypes.DATE },
                endDate: {type: DataTypes.DATE, allowNull: true},
                coast: { type: DataTypes.SMALLINT },
                visitingTime: { type: DataTypes.STRING, allowNull: false },
                
                isActive: DataTypes.BOOLEAN,

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