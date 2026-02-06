'use strict';

export async function up(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.addColumn('applications', 'final_score', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Average or total score from interviews'
    }),
    queryInterface.addColumn('applications', 'interview_slot_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'interviews', key: 'id' },
      onDelete: 'SET NULL'
    }),
    queryInterface.addColumn('applications', 'interview_start', {
      type: Sequelize.DATE,
      allowNull: true
    }),
    queryInterface.addColumn('applications', 'interview_end', {
      type: Sequelize.DATE,
      allowNull: true
    }),
    queryInterface.addColumn('applications', 'interview_invited_at', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Timestamp when the invitation email was sent'
    })
  ]);
}

export async function down(queryInterface, Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('applications', 'final_score'),
    queryInterface.removeColumn('applications', 'interview_slot_id'),
    queryInterface.removeColumn('applications', 'interview_start'),
    queryInterface.removeColumn('applications', 'interview_end'),
    queryInterface.removeColumn('applications', 'interview_invited_at')
  ]);
}