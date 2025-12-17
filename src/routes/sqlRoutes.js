const express = require('express');
const router = express.Router();
const sqlController = require('../controllers/sqlController');

router.get('/install', sqlController.install);

module.exports = router;