'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'salary', {
    type: Sequelize.STRING,
    allowNull: true
  });

  await queryInterface.addColumn('users', 'national_id', {
    type: Sequelize.STRING,
    allowNull: true
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('users', 'salary');
  await queryInterface.removeColumn('users', 'national_id');
}
