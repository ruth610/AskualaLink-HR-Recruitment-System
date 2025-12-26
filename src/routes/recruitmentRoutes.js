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
// quick test route for AI scoring
router.get(
    '/job',
    async (req, res) => {
        try {
            await triggerApplicationScoring('09834b1d-dc2e-46dd-b188-2bf6425bd298');
            return res.status(200).json({ message: 'AI scoring triggered' });
        } catch (error) {
            return res.status(500).json({ message: 'Error triggering AI scoring', error: error.message });
        }
    }
)


export { router }