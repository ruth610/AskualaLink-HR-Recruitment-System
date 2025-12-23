import { DataTypes, Model } from "sequelize";

const Application = (sequelize, DataTypes)=>{
    class Application extends Model{

        static associate(models) {
            Application.belongsTo(models.Job, {
                foreignKey: 'job_id',
                as: 'job',
            });

            Application.belongsTo(models.Applicant, {
                foreignKey: 'applicant_id',
                as: 'applicant',
            });
        }

    }

    Application.init( {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        job_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        applicant_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('PENDING','SHORTLISTED', 'REJECTED'),
            defaultValue: 'PENDING',
        },
        initial_fit_score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        final_fit_score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ai_status: {
            type: DataTypes.ENUM('PENDING','SHORTLISTED', 'REJECTED'),
            defaultValue: 'PENDING',
        },
        ai_summary: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        custom_field_values: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {}
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },{
        sequelize,
        modelName: 'Application',
        tableName: 'applications',
        underscored: true,
        }
    );
    return Application;
};

export default Application;