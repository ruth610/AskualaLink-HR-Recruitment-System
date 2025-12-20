import * as recruitmentService from '../services/recruitmentService.js';
import statusCode from 'http-status-codes';

async function createJob(req, res, next) {
    console.log("POSTMAN SENT:", req.body);
    try {
        const {
            title,
            department,
            deadline,
            requirements,
            status,
            type,
            location,
            salary_range,
            custom_fields,
            min_fit_score
        } = req.body;


        const created_by = req.user ? req.user.id : null;

        if (!created_by) {
             return res.status(statusCode.UNAUTHORIZED).json({
                 success: false,
                 message: "Unauthorized: User ID missing."
             });
        }
        const newJob = await recruitmentService.createNewJob({
            title,
            department,
            deadline,
            requirements,
            status,
            type,
            location,
            salary_range,
            custom_fields,
            min_fit_score,
            created_by
        });
        return res.status(statusCode.CREATED).json({
            success: true,
            message: "Job position created successfully.",
            data: newJob
        });

    } catch (error) {
        console.log(error);
        if(error.statusCode){
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
}

async function updateJob(req, res, next) {
    const jobId = req.params.id;
    const updateData = req.body;
    const userId = req.user ? req.user.id : null;
    const userRole = req.user ? req.user.role : null;

    try {
        const updatedJob = await recruitmentService.updateJob(jobId, updateData, userId, userRole);
        return res.status(statusCode.OK).json({
            success: true,
            message: "Job position updated successfully.",
            data: updatedJob
        });
    } catch (error) {
        console.log(error);
        if(error.statusCode){
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
}

async function deleteJob(req, res, next) {
    const jobId = req.params.id;
    const userId = req.user ? req.user.id : null;
    const userRole = req.user ? req.user.role : null;

    try {
        const result = await recruitmentService.deleteJob(jobId, userId, userRole);
        return res.status(statusCode.OK).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.log(error);
        if(error.statusCode){
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
}

async function getJobDetails(req, res, next) {
    // Implementation for retrieving job details
}

export { createJob, updateJob, deleteJob, getJobDetails };