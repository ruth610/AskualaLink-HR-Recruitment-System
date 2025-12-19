require('dotenv').config();
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../src/utils/swagger/swagger';
import sqlRoutes from './routes/sqlRoutes';
import authRoutes from './routes/authRoutes';


const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRoutes);
app.use('/sql', sqlRoutes);

module.exports = app;