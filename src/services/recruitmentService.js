import db from '../models/index.js';
import statusCode from 'http-status-codes';

const { Job } = db;

export async function createNewJob(jobData) {
    // 1. You can add extra business logic here if needed
    // (e.g., Check if a job with this title already exists in the same department)
    const {title,department,location,type,status} = jobData;
    const existingJob = await Job.findOne({
        where: {
            title: title,
            department: department,
            location: location,
            type: type,
            status: "OPEN"


        }
    });

    if (existingJob) {
        const error = new Error(`An active job posting for '${title}' in '${department}' already exists (Job ID: ${existingJob.id}). Please close it before creating a new one.`);
        error.statusCode = statusCode.CONFLICT;
        throw error;
    }

    const job = await Job.create(jobData);

    return job;
}

export const updateJob = async (jobId, updateData, userId, userRole) => {
    const job = await Job.findByPk(jobId);

    if (!job) throw new Error("Job not found");

    if (userRole !== 'ADMIN' && job.created_by !== userId) {
        throw new Error("Unauthorized to edit this job");
    }

    if (job.status === 'CLOSED') {
        throw new Error("Cannot edit a closed job posting");
    }

    return await job.update(updateData);
};

export const deleteJob = async (jobId, userId, userRole) => {
    const job = await Job.findByPk(jobId);

    if (!job) throw new Error("Job not found");

    if (userRole !== 'ADMIN' && job.created_by !== userId) {
        const err = new Error("You do not have permission to delete this job");
        err.statusCode = 403;
        throw err;
    }

    // // 2. Integrity Check (Count Applicants)
    // const applicantCount = await Application.count({ where: { job_id: jobId } });

    // if (applicantCount > 0) {
    //     // Soft Delete: Just hide it
    //     await job.update({ status: 'ARCHIVED' });
    //     return { message: "Job has applicants; it was archived instead of deleted." };
    // }

    // Hard Delete: Remove from DB
    await job.destroy();
    return { message: "Job deleted successfully." };
};