const express = require('express');
const router= express.Router();
const authController = require('../controllers/authController');
const authMiddleWare = require('../middlewares/authMiddleware');

router.post('/create-user', authMiddleWare, authorizeRoles('ADMIN'), authController.createUser);
router.post('/login', authMiddleWare,authController.login);

module.exports = router;