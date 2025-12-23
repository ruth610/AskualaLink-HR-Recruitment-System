import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_API_KEY,
});

export async function scoreApplication({
  job,
  applicant,
  application,
}) {
  const prompt = `
    You are an Applicant Tracking System (ATS).

    JOB:
        Title: ${job.title}
        Department: ${job.department}
        Requirements: ${job.requirements}

    APPLICANT:
        Name: ${applicant.full_name}
        Email: ${applicant.email}

    CUSTOM FIELD ANSWERS:
        ${JSON.stringify(application.custom_field_values, null, 2)}

    APPLICANT RESUME:
        ${applicant.resume_text?.slice(0, 3000)}

    TASK:
        1. Give a fit score from 0 to 10
        2. Write a short professional summary (max 4 sentences)

    Return JSON only:
        {
        "initial_fit_score": number,
        "ai_summary": string
        }
        `;

    const response = await client.chat.completions.create({
        model: "gpt-4.1-mini", // cheap + good
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
    });

    const content = response.choices[0].message.content;
    console.log(JSON.parse(content));
    return JSON.parse(content);
}
