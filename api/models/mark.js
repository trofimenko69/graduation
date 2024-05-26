import { DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default class Mark extends Model {
    static initialize(sequelize) {
        Mark.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },

                mark: DataTypes.INTEGER,
                text: DataTypes.STRING,
            },
            {
                sequelize,
                modelName: 'Mark',
                tableName: 'marks',
            }
        );

        Mark.beforeCreate(m => {
            m.id = uuidv4();
        });
    }
    static setupScopes(models) {
        this.addScope('info', () => ({
            include: [
                { model: models.User, as: 'user', attributes: ['id', 'fio', 'logo'], paranoid: false },
                { model: models.Company, as: 'company', attributes: ['id', 'name', 'logo'], paranoid: false },
            ],
        }));
    }
}