import { DataTypes, Model} from "sequelize";
import {v4 as uuidv4} from "uuid";
import states from "../config/states.json" assert { type: "json" };


export default class Agreement extends Model {
    static initialize(sequelize){
        Agreement.init({
            id: { type: DataTypes.UUID, primaryKey: true },
            states: {
                type: DataTypes.SMALLINT,
                allowNull: false,
                defaultValue: states.NO_ACTIVE,
                validate: { isIn: [Object.values(states)] },
            },

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