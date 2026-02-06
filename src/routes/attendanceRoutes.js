import express from 'express';
import * as attendanceController from '../controllers/attendanceController.js';
import { authMiddleWare } from '../middlewares/authMiddleware.js';
import { checkOfficeIP } from '../middlewares/verifyWiFiMiddleware.js';

const router = express.Router();

router.post(
    '/clock-in',
    authMiddleWare,
    checkOfficeIP,
    attendanceController.clockIn
);

router.post(
    '/clock-out',
    authMiddleWare,
    checkOfficeIP,
    attendanceController.clockOut
);

export default router;
