require('dotenv').config();
const express = require('express');
const sqlRoutes = require('./routes/sqlRoutes');


const app = express();
app.use(express.json());
app.use('/sql', sqlRoutes);

module.exports = app;