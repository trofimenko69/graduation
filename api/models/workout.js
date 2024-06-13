import { DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default class Workout extends Model {
        static initialize(sequelize){
            Workout.init({
                id: { type: DataTypes.UUID, primaryKey: true },
                date: { type: DataTypes.DATEONLY, allowNull: false },
                time: { type: DataTypes.TIME, allowNull: false },
                duration: { type: DataTypes.TIME, allowNull: false },
                type: { type: DataTypes.STRING, allowNull: false},
                leisurePlaces: { type: DataTypes.SMALLINT, allowNull: false, default: 15 },

            },
                {
                    sequelize,
                    modelName: 'Workout',
                    tableName: 'workouts',
                })
            Workout.beforeCreate(w=>{
                w.id=uuidv4();
            })
        }
}