'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('resumes', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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

    resume_hash: {
      type: Sequelize.STRING(64),
      unique: true,
      allowNull: false,
    },

    raw_text: {
      type: Sequelize.TEXT,
      allowNull: false,
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

}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('resumes');
}
