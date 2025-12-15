require('dotenv').config();
const express = require('express');
const installRoute = require('./shared/db/dbConfig');


const app = express();
app.use(express.json());
app.use('/install', installRoute);


module.exports = app;