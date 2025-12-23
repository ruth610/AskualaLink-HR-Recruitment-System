import { DataTypes, Model } from "sequelize";

const Applicant = (sequelize, DataTypes) =>{
    class Applicant extends Model{
        static associate(models) {
            Applicant.hasMany(models.Application, {
                foreignKey: 'applicant_id',
                as: 'applications',
            });

        }
    }

    Applicant.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resume_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
        }, {
        sequelize,
        modelName: 'Applicant',
        tableName: 'applicants',
        underscored: true,
    });


}

export default Applicant;