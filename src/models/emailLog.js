'use strict';
import { Model } from 'sequelize';

const EmailLog = (sequelize, DataTypes) => {
  class EmailLog extends Model {}

    EmailLog.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
        from: {
            type: DataTypes.STRING,
            allowNull: false
        },
        to: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'SENT', 'FAILED', 'RETRYING'),
            defaultValue: 'PENDING'
        },
        provider_id: {
            type: DataTypes.STRING
        },
        error_details: {
            type: DataTypes.TEXT
        },
        retry_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        metadata: {
            type: DataTypes.JSONB
        }
    },
    {
            sequelize,
            modelName: 'EmailLog',
            tableName: 'email_logs',
            underscored: true,
            timestamps: true,
        }
);

  return EmailLog;
};

export default EmailLog;