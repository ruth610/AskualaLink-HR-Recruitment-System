'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
       id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      department: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      deadline: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM('OPEN', 'CLOSED', 'ARCHIVED'),
        allowNull: false,
        defaultValue: 'OPEN',
      },

      requirements: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      type: {
        type: Sequelize.ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'),
        allowNull: false,
      },

      location: {
        type: Sequelize.ENUM('REMOTE', 'ON_SITE', 'HYBRID'),
        allowNull: false,
      },

      salary_range: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      custom_fields: {
        type: Sequelize.JSONB,
        allowNull: true,
      },

      min_fit_score: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users', // must match users table name
          key: 'id',
        },
        onDelete: 'RESTRICT', // prevent deleting user if jobs exist
        onUpdate: 'CASCADE',
      },

      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
});
};

export async function down (queryInterface, Sequelize) {
    await queryInterface.dropTable('jobs');

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_jobs_status";
      DROP TYPE IF EXISTS "enum_jobs_type";
      DROP TYPE IF EXISTS "enum_jobs_location";
    `);

};

