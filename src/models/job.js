'use strict';
import {DataTypes, Model} from 'sequelize';


const Job = (sequelize, DataTypes)=>{
    class Job extends Model{
        static associate(models) {
            Job.belongsTo(models.User, {
                foreignKey: 'created_by',
                as: 'creator',
        });
            Job.hasMany(models.Application, {
                foreignKey: 'job_id',
                as: 'applications',
            });
        }
    }

    Job.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            department: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            deadline: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            status:{
                type: DataTypes.ENUM('OPEN', 'CLOSED', 'ARCHIVED'),
                allowNull: false,
                defaultValue: 'OPEN',
            },
            requirements:{
                type: DataTypes.TEXT,
                allowNull: false,
            },
            type:{
                type: DataTypes.ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'),
                allowNull: false,
            },
            location:{
                type: DataTypes.ENUM('REMOTE', 'ON_SITE', 'HYBRID'),
                allowNull: false,
            },
            salary_range:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            custom_fields:{
                type: DataTypes.JSONB,
                allowNull: true,
            },
            min_fit_score:{
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            created_by:{
                type: DataTypes.UUID,
                allowNull: false,
            },
            updated_by:{
                type: DataTypes.UUID,
                allowNull: true,
            },

        },

        {
            sequelize,
            modelName: 'Job',
            tableName: 'jobs',
            underscored: true,
            timestamps: true,
        }
    );
    return Job;
}
export default Job;