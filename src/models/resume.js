'use strict';
import {DataTypes, Model} from 'sequelize';


const Resume = (sequelize, DataTypes)=>{
    class Resume extends Model{
        static associate(models) {
            Resume.belongsTo(models.Applicant, {
                foreignKey: 'applicant_id',
                as: 'applicant',
            });
        }
    }
    Resume.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    applicantId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    resumeHash: {
        type: DataTypes.STRING(64),
        unique: true,
    },
    rawText: {
        type: DataTypes.TEXT,
    },

    },
    {
        sequelize,
        modelName: 'Resume',
        tableName: 'resumes',
        underscored: true,
        timestamps: true,
    }
    );
    return Resume;
};

export default Resume;