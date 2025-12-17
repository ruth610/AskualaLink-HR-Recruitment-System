require('dotenv').config();
const express = require('express');
const sqlRoutes = require('./routes/sqlRoutes');
const authRoutes = require('./routes/authRoutes');


const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/sql', sqlRoutes);

module.exports = app;