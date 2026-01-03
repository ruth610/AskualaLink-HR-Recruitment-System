'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('interviews', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    job_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'jobs', key: 'id' },
      onDelete: 'CASCADE'
    },
    application_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'applications', key: 'id' },
      onDelete: 'CASCADE'
    },
    start_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    end_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'),
      defaultValue: 'SCHEDULED',
      allowNull: false
    },
    meeting_link: {
      type: Sequelize.STRING,
      allowNull: true
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });

  await queryInterface.addIndex('interviews', ['start_time']);
  await queryInterface.addIndex('interviews', ['application_id']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('interviews');
}