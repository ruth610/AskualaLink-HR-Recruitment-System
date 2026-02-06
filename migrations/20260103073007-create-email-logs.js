'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('email_logs', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'SET NULL',
      field: 'user_id'
    },
    from: {
      type: Sequelize.STRING,
      allowNull: false
    },
    to: {
      type: Sequelize.STRING,
      allowNull: false
    },
    subject: {
      type: Sequelize.STRING,
      allowNull: false
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('PENDING', 'SENT', 'FAILED', 'RETRYING'),
      defaultValue: 'PENDING',
      allowNull: false
    },
    provider_id: {
      type: Sequelize.STRING,
      field: 'provider_id'
    },
    error_details: {
      type: Sequelize.TEXT,
      field: 'error_details'
    },
    retry_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      field: 'retry_count'
    },
    metadata: {
      type: Sequelize.JSONB
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

  await queryInterface.addIndex('email_logs', ['to']);
  await queryInterface.addIndex('email_logs', ['status']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('email_logs');
}