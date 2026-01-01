import express from 'express';
import * as payrollController from '../controllers/payrollController.js';
import { authMiddleWare } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';


const router = express.Router();

router.get(
    '/generate/:userId/:month/:year',
    authMiddleWare,
    authorizeRoles('ADMIN', 'HR'),
    payrollController.generatePayroll
)

export {router};