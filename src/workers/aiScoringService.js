import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function scoreApplication({ job, applicant, application }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const resume_text = applicant.resume_text;
    if(!resume_text){
      throw new Error("Applicant resume text is missing");
    }
    const prompt = `
      You are an strict Applicant Tracking System (ATS). Analyze the following candidate.

      JOB DETAILS:
      - Title: ${job.title}
      - Department: ${job.department}
      - Requirements: ${job.requirements}

      APPLICANT DATA:
      - Name: ${applicant.full_name}
      - Custom Answers: ${JSON.stringify(application.custom_field_values)}
      - Resume Text: "${resume_text.slice(0, 4000) || "No resume text provided"}"

      TASK:
      1. Calculate a fit score from 0 to 100 based on how well the resume matches the requirements.
      2. Write a professional summary (max 3 sentences) justifying the score.

      OUTPUT FORMAT:
      Return strictly a raw JSON object with no markdown formatting or backticks.
      {
        "initial_fit_score": number,
        "ai_summary": string
      }
    `;

    const result = await model.generateContent(prompt);
    // console.log(result);
    const response = result.response;
    let text = response.text();

    text = text.replace(/```json|```/g, "").trim();

    const parsedData = JSON.parse(text);

    return parsedData;

  } catch (error) {
    // console.error("Gemini AI Error:", error.message);
    throw error;
  }
}