import express from 'express';
import * as recruitmentController from '../controllers/recruitmentController.js';
import  {authMiddleWare}  from '../middlewares/authMiddleware.js';
import  {authorizeRoles}  from '../middlewares/roleMiddleware.js';
import { uploads } from '../middlewares/uploadMiddleware.js';
import { validateRequest } from '../middlewares/jobMiddleware.js';
import { createJobSchema } from '../middlewares/jobMiddleware.js';
import {triggerApplicationScoring} from '../workers/aiTrigger.js';

const router = express.Router();

router.post(
    '/create-job',
    authMiddleWare,
    authorizeRoles('ADMIN'),
    validateRequest(createJobSchema),
    recruitmentController.createJob
);
router.put(
    '/update-job/:id',
    authMiddleWare,
    authorizeRoles('ADMIN'),
    validateRequest(createJobSchema),
    recruitmentController.updateJob
);
router.delete(
    '/delete-job/:id',
    authMiddleWare,
    authorizeRoles('ADMIN'),
    recruitmentController.deleteJob
);

router.get(
    '/job-details/:id',
    authMiddleWare,
    recruitmentController.getJobDetails
);
router.post(
    '/jobs/:id/apply',
    uploads.single('resume'),
    recruitmentController.applyJob
);


export { router }