import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not configured.");
}

const openai = new OpenAI({
  apiKey,
});

export async function analyzeResumeWithAI(
  resumeText: string
) {
  const response = await openai.responses.create({
    model: "gpt-5.6-luna",
    instructions: `
You are an expert technical recruiter and resume analyst.

Analyze the provided resume and return ONLY valid JSON.

The JSON must contain:
{
  "summary": "short professional summary",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "technicalSkills": ["skill 1", "skill 2"],
  "softSkills": ["skill 1", "skill 2"],
  "experienceLevel": "Fresher | Entry Level | Mid Level | Senior Level",
  "atsScore": 0,
  "atsSuggestions": ["suggestion 1", "suggestion 2"],
  "improvementSuggestions": ["suggestion 1", "suggestion 2"]
}

Rules:
- atsScore must be an integer from 0 to 100.
- Do not invent experience, education, projects, or skills.
- Base every conclusion on the supplied resume.
- Keep suggestions practical and specific.
`,
    input: `Analyze this resume:

${resumeText}`,
  });

  const text = response.output_text.trim();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("AI returned invalid JSON.");
  }
}