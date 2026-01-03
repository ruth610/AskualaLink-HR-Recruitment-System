'use strict';
import { Model } from 'sequelize';

const Interview = (sequelize, DataTypes) => {
  class Interview extends Model {}

  Interview.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'job_id'
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'application_id'
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_time'
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_time'
    },
    status: {
      type: DataTypes.ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'),
      defaultValue: 'SCHEDULED'
    },
    meetingLink: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'meeting_link'
    }
  }, {
    sequelize,
    modelName: 'Interview',
    tableName: 'interviews',
    underscored: true,
    timestamps: true,
  });

  Interview.associate = (models) => {
    Interview.belongsTo(models.Job, { foreignKey: 'job_id', as: 'job' });
    Interview.belongsTo(models.Application, { foreignKey: 'application_id', as: 'application' });
  };

  return Interview;
};

export default Interview;