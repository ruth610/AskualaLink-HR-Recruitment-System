'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('applications', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
      allowNull: false,
    },

    job_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'jobs',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    applicant_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'applicants',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    status: {
      type: Sequelize.ENUM('PENDING', 'SHORTLISTED', 'REJECTED'),
      defaultValue: 'PENDING',
    },

    initial_fit_score: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    final_fit_score: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    ai_summary: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    ai_status: {
      type: Sequelize.ENUM('PENDING', 'SHORTLISTED', 'REJECTED'),
      defaultValue: 'PENDING',
    },
    custom_field_values: {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },

    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });

  // prevent duplicate applications
  await queryInterface.addConstraint('applications', {
    fields: ['job_id', 'applicant_id'],
    type: 'unique',
    name: 'unique_job_applicant',
  });

}

export async function down(queryInterface) {
  await queryInterface.dropTable('applications');
}
