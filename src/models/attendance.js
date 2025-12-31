import { DataTypes, Model } from 'sequelize';

const Attendance = (sequelize, DataTypes)=>{
    class Attendance extends Model{
        static associate(models) {
            Attendance.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user',
            });
        }
    }

    Attendance.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        clock_in: {
            type: DataTypes.DATE
        },
        clock_out: {
            type: DataTypes.DATE
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'PRESENT', 'LATE', 'ABSENT'),
            allowNull: false,
            defaultValue: 'PENDING'
        }
    }, {
        sequelize,
        modelName: 'Attendance',
        tableName: 'attendance',
        indexes: [
        {
            unique: true,
            fields: ['user_id', 'date']
        }
        ]
  });

  return Attendance;
};
export default Attendance;