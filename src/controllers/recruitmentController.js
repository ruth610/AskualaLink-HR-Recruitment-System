import * as recruitmentService from '../services/recruitmentService.js';
import statusCode from 'http-status-codes';
import fs from 'fs/promises';
import { triggerApplicationScoring } from '../workers/aiTrigger.js';

async function createJob(req, res, next) {
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
    const jobId = req.params.id;
    try {
        const jobDetails = await recruitmentService.getJobDetails(jobId);
        return res.status(statusCode.OK).json({
            success: true,
            data: jobDetails
        });
    }
    catch (error) {
        if(error.statusCode){
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
}

const applyJob = async (req, res,next) => {
    const cleanupFile = async () => {
        if (req.file) await fs.unlink(req.file.path).catch(() => {});
    };

    try {
        if (!req.file) {
            return res.status(statusCode.BAD_REQUEST).json({ message: 'Resume is required' });
        }

        const resumePath = req.file.path;
        const { full_name, email, phone ,custom_field_values} = req.body;
        const jobId = req.params.id;
        if(!full_name){
            await cleanupFile();
            return  res.status(statusCode.BAD_REQUEST).json({ message: 'Full name is required' });
        }
        if(!email){
            await cleanupFile();
            return  res.status(statusCode.BAD_REQUEST).json({ message: 'Email is required' });
        }

        let parsedCustomFieldValues = custom_field_values;
        if (typeof custom_field_values === 'string') {
            try {
                parsedCustomFieldValues = JSON.parse(custom_field_values);
            } catch (error) {
                 await cleanupFile();
                 return res.status(statusCode.BAD_REQUEST).json({ message: 'Invalid custom_field_values format' });
            }
        }

        const application = await recruitmentService.applyToJob(jobId, {
            full_name,
            email,
            phone,
            resumeUrl: resumePath,
            custom_field_values: parsedCustomFieldValues,
        });

        setImmediate(() => {
            triggerApplicationScoring(application.id);
        });

        return res.status(statusCode.CREATED).json({
            message: 'Application submitted successfully',
            data: application,
        });

        } catch (error) {
            await cleanupFile();
            next(error);
        }
};

async function inviteToInterview (req, res, next) {
  try {
    const { id } = req.params;
    const interviewData = req.body;

    if (!id) {
      return res.status(400).json({
        message: 'JOB ID is required'
      });
    }
    if(!interviewData){
      return res.status(400).json({
        message: 'Interview data is required'
      });
    }
    // console.log(interviewData);
    const result = await recruitmentService.inviteApplicantToInterview(id, interviewData);
    // console.log(result);
    if(!result){
      return res.status(result.statusCode).json({
        message: result.message
      });
    }

    return res.status(200).json({
      message: 'Interview invitation sent successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};


export { createJob, updateJob, deleteJob, getJobDetails, applyJob, inviteToInterview };