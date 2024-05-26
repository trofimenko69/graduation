import { DataTypes, Model} from "sequelize";
import {v4 as uuidv4} from "uuid";


export default class Agreement extends Model {
    static initialize(sequelize){
        Agreement.init({
            id: { type: DataTypes.UUID, primaryKey: true },

        },{
            sequelize,
            modelName: 'Agreement',
            tableName: 'agreements',
            paranoid: true,
        })

        Agreement.beforeCreate(a=>{
          a.id = uuidv4();
        })
    }
}