import {DataTypes, Model} from "sequelize";
import {v4 as uuidv4} from "uuid";


export default class Coach extends Model{
    static initialize(sequelize){
        Coach.init({
                id: {type: DataTypes.UUID, primaryKey: true},
                /*login: {
                    type: DataTypes.STRING,
                    validate: {isEmail: {msg: 'Must be a valid email address'}},
                    allowNull: false,
                    unique: 'login',
                },
                password: { type: DataTypes.STRING, allowNull: true },*/

                fio: DataTypes.STRING,
                experience: { type: DataTypes.SMALLINT, allowNull: false },
                directions: { type: DataTypes.TEXT, allowNull: false },
                description: DataTypes.TEXT,
                phone: DataTypes.STRING,

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