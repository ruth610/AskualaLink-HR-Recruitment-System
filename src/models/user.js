'use strict';
import { Model } from 'sequelize';
import { encrypt } from '../utils/crypto.js';

const User = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Job, {
        foreignKey: 'created_by',
        as: 'jobs',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('ADMIN', 'HR', 'STAFF'),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
        salary: {
        type: DataTypes.STRING,
        allowNull: true
      },

      national_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      timestamps: true,
      hooks: {
        beforeCreate(user) {
          if (user.salary) {
            user.salary = encrypt(user.salary);
          }

          if (user.national_id) {
            user.national_id = encrypt(user.national_id);
          }
        },

        beforeUpdate(user) {
          if (user.changed('salary')) {
            user.salary = encrypt(user.salary);
          }

          if (user.changed('national_id')) {
            user.national_id = encrypt(user.national_id);
          }
        }
      }
    }
  );

  return User;
};
export default User;