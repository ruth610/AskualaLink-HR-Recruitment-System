require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../src/utils/swagger/swagger');
const sqlRoutes = require('./routes/sqlRoutes');
const authRoutes = require('./routes/authRoutes');


const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRoutes);
app.use('/sql', sqlRoutes);

module.exports = app;