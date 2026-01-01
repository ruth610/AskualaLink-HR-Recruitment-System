'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('attendance', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    clock_in: {
      type: Sequelize.DATE,
      allowNull: true
    },
    clock_out: {
      type: Sequelize.DATE,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('PENDING','PRESENT','LATE','ABSENT','INCOMPLETE','UNDER_TIME'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('NOW()')
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('NOW()')
    }
  });

  await queryInterface.addIndex('attendance', ['user_id', 'date'], {
    unique: true,
    name: 'attendance_user_date_unique'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('attendance');
}
