import {DataTypes, Model} from "sequelize";
import {v4 as uuidv4} from "uuid";

export default class History extends Model{
    static initialize(sequelize){
        History.init(
            {
                id: {type: DataTypes.UUID, primaryKey: true },
                type: {type: DataTypes.STRING, allowNull: false },
                date: { type: DataTypes.DATE, allowNull: false }
            },
            {
                sequelize,
                modelName: 'History',
                tableName: 'history',
                paranoid: true,
            }
        );

        History.beforeCreate(h=>{
            h.id=uuidv4();
        })
    }
}