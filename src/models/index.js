import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import config from '../../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const db = {};

const sequelize = new Sequelize(dbConfig.url, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});


const files = fs.readdirSync(__dirname).filter(
  file => file !== 'index.js' && file.endsWith('.js')
);

for (const file of files) {
  const moduleImport = await import(path.join(__dirname, file));
  const model = moduleImport.default(sequelize, DataTypes);
  db[model.name] = model;
}

Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
