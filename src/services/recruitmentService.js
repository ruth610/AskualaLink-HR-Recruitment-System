import db from '../models/index.js';
import statusCode from 'http-status-codes';
import { validateJobAnswers } from '../utils/dynamicValidator.js';
import { extractResumeText } from '../utils/resumeTextExtractor.js';
import { normalizeResume } from '../utils/textNormalize.js';
import { sha256 } from '../utils/textHash.js';
import { triggerApplicationScoring } from '../workers/aiTrigger.js';
import { interviewInviteTemplate } from '../workers/emailTemplates.js';
import { generateSlots } from '../utils/interviewSlots.js';
import { sendEmail } from './emailService.js';
import { Sequelize } from 'sequelize';

const { Job, Applicant, Application, Resume, Interview, sequelize } = db;

export async function createNewJob(jobData) {
    // 1. You can add extra business logic here if needed
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
    const applicantCount = await Application.count({ where: { job_id: jobId } });

    if (applicantCount > 0) {
        // Soft Delete: Just hide it
        await job.update({ status: 'ARCHIVED' });
        return { message: "Job has applicants; it was archived instead of deleted." };
    }

    await job.destroy();
    return { message: "Job deleted successfully." };
};

export const getJobDetails = async (jobId) => {
    const job = await Job.findByPk(jobId);
    if (!job) {
        const error = new Error("Job not found");
        error.statusCode = statusCode.NOT_FOUND;
        throw error;
    }
    return job;
};

export const applyToJob = async (jobId, payload) => {
  const transaction = await db.sequelize.transaction();

  try {
    const job = await Job.findByPk(jobId, { transaction });
    if (!job) {
      const error = new Error("Job not found");
      error.statusCode = statusCode.NOT_FOUND;
      throw error;
    }
    const {deadline,status,custom_fields} = job;
    const currentDate = new Date();

    if(currentDate > deadline){
        const error = new Error("Application deadline has passed");
        error.statusCode = statusCode.BAD_REQUEST;
        throw error;
    }
    if(status !== 'OPEN'){
        const error = new Error("Job is not open for applications");
        error.statusCode = statusCode.BAD_REQUEST;
        throw error;
    }
    const validationErrors = validateJobAnswers(custom_fields, payload.custom_field_values);

    if (validationErrors) {
        const error = new Error("Validation errors in custom fields: " + validationErrors.join(', '));
        error.statusCode = statusCode.BAD_REQUEST;
        throw error;
    }
    // console.log(payload.resumeUrl);
    const textResume = await extractResumeText(payload.resumeUrl);
    // console.log(textResume);

    if(!textResume){
        const error = new Error("Could not extract text from resume");
        error.statusCode = statusCode.BAD_REQUEST;
        throw error;
    }

    let applicant = await Applicant.findOne({
      where: { email: payload.email },
      transaction,
    });
    if (!applicant) {
      applicant = await Applicant.create({
        full_name: payload.full_name,
        email: payload.email,
        phone: payload.phone,
        resume_url: payload.resumeUrl,
        resume_text: textResume,
      }, { transaction });
    }

    const normalized = normalizeResume(textResume);
    const hash = sha256(normalized);

    const existing = await Resume.findOne({
      where: { resumeHash: hash },
      transaction,
    });

    if(existing){
      if ( existing.applicantId !== applicant.id ) {
        const error = new Error("Exact duplicate resume found");
        error.statusCode = statusCode.CONFLICT;
        throw error;
      }

    }
    else{
      const resume = await Resume.create(
      {
        resumeHash: hash,
        rawText: textResume,
        applicantId: applicant.id,
      },
      { transaction }
      );
    }

    const existingApplication = await Application.findOne({
        where: {
            job_id: jobId,
            applicant_id: applicant.id,
        },
        transaction,
    });

    if (existingApplication) {
        const error = new Error("You have already applied for this job");
        error.statusCode = statusCode.CONFLICT;
        throw error;
    }
    const application = await Application.create({
      job_id: jobId,
      applicant_id: applicant.id,
      custom_field_values: payload.custom_field_values,
      },
      { transaction });
    await transaction.commit();
    // Trigger AI Scoring Asynchronously
    triggerApplicationScoring(application.id).catch(err => {
        console.error("AI Scoring Trigger Failed:", err);
    });

    return application;

  } catch (error) {
    // console.log(error);
    if(transaction) await transaction.rollback();
    throw error;
  }
};

export const inviteApplicantToInterview = async (job_id, interviewData) => {
  let processedCandidates = [];
  let jobTitle = '';

  try {
    processedCandidates = await sequelize.transaction(async (t) => {

      const job = await Job.findByPk(job_id, { transaction: t });
      if (!job) {
        const error = new Error('Job not found');
        error.statusCode = statusCode.NOT_FOUND;
        throw error;
      }
      jobTitle = job.title;
      console.log(jobTitle);
      console.log(job_id);
      const candidates = await Application.findAll({
        where: { job_id, ai_status: 'SHORTLISTED' },
        include: [{ model: Applicant, as: 'applicant' }],
        order: [['initial_fit_score', 'DESC']],
        transaction: t
      });

      if (!candidates || candidates.length === 0) {
        const error = new Error('No shortlisted applications found for this job');
        error.statusCode = statusCode.NOT_FOUND;
        throw error;
      }
      // check if the interview schedule is not created yet
      const existingInterviews = await Interview.count({
        where: { jobId: job_id },
        transaction: t
      });

      if (existingInterviews > 0) {
        console.log("Interviews already exist. Proceeding to email phase only.");
        return candidates;
      }

      const slots = generateSlots(interviewData, candidates.length);
      console.log(slots);
      const results = [];

      for (let i = 0; i < candidates.length; i++) {
        const slot = slots[i];
        const app = candidates[i];

        const interview = await Interview.create({
          jobId: job_id,
          applicationId: app.id,
          startTime: slot.start,
          endTime: slot.end,
          status: 'SCHEDULED',
          meetingLink: interviewData.meeting_link
        }, { transaction: t });

        app.status = 'SHORTLISTED';
        // console.log(`Scheduled interview for Application ID: ${app.id} from ${slot.start} to ${slot.end}`);
        app.interviewStart = slot.start;
        app.interviewEnd = slot.end;
        app.interviewSlotId = interview.id;
        app.interviewInvitedAt = new Date();

        await app.save({
          fields: ['status', 'interview_start', 'interview_end', 'interview_slot_id', 'interview_invited_at'],
          transaction: t
        });
        
        results.push({
          id: app.id,
          interview_start: app.interview_start,
          interview_end: app.interview_end,
          applicant: app.applicant
        });
      }
      return results;
    });

    const emailPromises = processedCandidates.map(async (app) => {
      try {
        console.log('here it is');
        // console.log(app);
        const applicantData = app.applicant;
        console.log(applicantData.full_name);
        if (!applicantData || !applicantData.email) {
          const error = new Error(`Applicant data or email missing for Application ID: ${app.id}`);
          error.statusCode = statusCode.BAD_REQUEST;
          throw error;
        }

        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const inviteHtml = interviewInviteTemplate({
          name: applicantData.full_name,
          role: jobTitle,
          interviewDay: new Date(app.interview_start).toLocaleDateString('en-US', dateOptions),
          startDate: new Date(app.interview_start).toLocaleTimeString('en-US', timeOptions),
          endDate: new Date(app.interview_end).toLocaleTimeString('en-US', timeOptions),
          meetingLink: interviewData.meeting_link
        });
        // console.log(applicantData.email);
        const email = await sendEmail({
          to: applicantData.email,
          subject: `Interview Invitation: ${jobTitle}`,
          html: inviteHtml
        });
        // console.log(email);

      } catch (emailErr) {
        console.error(`Failed to email applicant ${app.id}:`, emailErr.message);
      }
    });

    await Promise.all(emailPromises);

    return {
      message: `Successfully scheduled ${processedCandidates.length} interviews`,
      count: processedCandidates.length
    };

  } catch (error) {
    // console.log(error);
    if (!error.statusCode) error.statusCode = statusCode.INTERNAL_SERVER_ERROR;
    throw error;
  }
};