import { DataTypes } from 'sequelize';

const Payroll = (sequelize, DataTypes) => {
    class Payroll extends sequelize.Model {
        static associate(models) {
            Payroll.belongsTo(
                models.User,
                { foreignKey: 'user_id',
                    as: 'employee'
                });
            Payroll.belongsTo(
                models.User,
                { foreignKey: 'generated_by',
                    as: 'creator'
                });
        }
    }

  Payroll.init({
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^\d{4}-\d{2}$/
      }
    },
    base_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    total_allowance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    gross_pay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    taxable_income: DataTypes.DECIMAL(10, 2),
    income_tax: DataTypes.DECIMAL(10, 2),
    pension: DataTypes.DECIMAL(10, 2),
    total_deductions: DataTypes.DECIMAL(10, 2),

    net_pay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    working_days: DataTypes.INTEGER,
    present_days: DataTypes.INTEGER,
    status: {
        type: DataTypes.ENUM('DRAFT', 'PENDING', 'PAID'),
        defaultValue: 'DRAFT'
    },
    generated_by: DataTypes.INTEGER
  }, {
        sequelize,
        modelName: 'Payroll',
        tableName: 'payrolls',
        underscored: true,
        timestamps: true,
  });

  return Payroll;
};