import db from "../models/index.js";
import { scoreApplication } from "./aiScoringService.js";

export async function triggerApplicationScoring(applicationId) {
  try {
    const application = await db.Application.findByPk(applicationId, {
      include: [
        { model: db.Job, as: "job" },
        { model: db.Applicant, as: "applicant" },
      ],
    });

    if (!application || application.initial_fit_score !== null) return;

    const result = await scoreApplication({
      job: application.job,
      applicant: application.applicant,
      application,
    });

    if (!result || typeof result.initial_fit_score !== 'number' || !result.ai_summary) {
      throw new Error("Invalid AI response");
    }
    const initial_fit = Math.floor((result.initial_fit_score / 100) * 10);
    const job = application.job;
    const min_fit_score = job.min_fit_score || 0;
    await application.update({
      initial_fit_score: initial_fit,
      ai_summary: result.ai_summary,
      ai_status: initial_fit >= min_fit_score ? 'SHORTLISTED' : 'REJECTED',
    });

    // console.log(result);
    // console.log(`Application ${applicationId} scored`);
  } catch (err) {
    const application = await db.Application.findByPk(applicationId);
    if (!application) return;
    await application.update({
      initial_fit_score: null,
      ai_status: 'REJECTED',
    });
    console.error("AI scoring failed:", err.message);
  }
}
