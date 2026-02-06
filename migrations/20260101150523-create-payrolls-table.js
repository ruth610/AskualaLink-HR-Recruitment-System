'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('payrolls', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'RESTRICT'
    },
    month: {
      type: Sequelize.STRING,
      allowNull: false
    },

    base_salary: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    total_allowance: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    gross_pay: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },

    taxable_income: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    income_tax: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    pension: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      comment: '7% Employee Share'
    },
    total_deductions: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },

    net_pay: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },

    working_days: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    present_days: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('DRAFT', 'PENDING', 'PAID', 'CANCELLED'),
      defaultValue: 'DRAFT',
      allowNull: false
    },
    generated_by: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    payment_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  });

  // Unique constraint ensures an employee is paid only once per month
  await queryInterface.addIndex('payrolls', ['user_id', 'month'], {
    unique: true
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('payrolls');
}