import {DataTypes, Model} from "sequelize";
import {v4 as uuidv4} from "uuid";


export default class Coach extends Model{
    static initialize(sequelize){
        Coach.init({
                id: { type: DataTypes.UUID, primaryKey: true},
                fio: { type: DataTypes.STRING, allowNull: false },
                experience: { type: DataTypes.SMALLINT, allowNull: false },
                directions: { type: DataTypes.TEXT, allowNull: false },
                description: DataTypes.TEXT,
                phone: { type: DataTypes.STRING, allowNull: false },
                logo: DataTypes.BOOLEAN,
                summary: DataTypes.BOOLEAN,

            },
            {
                sequelize,
                modelName: 'Coach',
                tableName: 'coaches',
                paranoid: true,
            },

        )

        Coach.beforeCreate(c => {
                c.id = uuidv4();
        });


    }
}