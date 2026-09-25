import { NextResponse } from "next/server";

import connectDB from "../../../lib/mongodb";
import { getCurrentUser } from "../../../lib/auth";
import { extractSkills } from "../../../lib/skill-extractor";
import Resume from "../../../models/Resume";

export const runtime = "nodejs";

type SkillStatus =
  | "matched"
  | "partial"
  | "missing";

type SkillResult = {
  skill: string;
  status: SkillStatus;
  importance: "High" | "Medium";
  action: string;
};

const PARTIAL_RELATIONSHIPS: Record<
  string,
  string[]
> = {
  "Deep Learning": ["Machine Learning"],
  PyTorch: ["Python", "Deep Learning"],
  TensorFlow: ["Python", "Deep Learning"],
  MLOps: ["Docker", "Machine Learning"],
  FastAPI: ["Python", "REST API"],
  Docker: ["Git"],
  AWS: ["Docker"],
  "REST API": [
    "JavaScript",
    "Node.js",
    "Python",
  ],
  React: ["JavaScript"],
  "Next.js": ["React", "JavaScript"],
  "Node.js": ["JavaScript"],
  "Express.js": ["Node.js", "JavaScript"],
  TypeScript: ["JavaScript"],
  MongoDB: ["NoSQL"],
};

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    if (!description) {
      return NextResponse.json(
        {
          message:
            "Job description is required.",
        },
        { status: 400 }
      );
    }

    if (description.length < 50) {
      return NextResponse.json(
        {
          message:
            "Please provide a more detailed job description.",
        },
        { status: 400 }
      );
    }

    if (description.length > 30000) {
      return NextResponse.json(
        {
          message:
            "Job description is too long. Maximum 30,000 characters.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const resume =
      await Resume.findOne({
        userId: user.userId,
        status: "completed",
      }).sort({
        createdAt: -1,
      });

    if (!resume) {
      return NextResponse.json(
        {
          message:
            "Please upload and analyze a resume first.",
        },
        { status: 404 }
      );
    }

    // Skills required by the job description
    const requiredSkills =
      extractSkills(description);

    if (requiredSkills.length === 0) {
      return NextResponse.json(
        {
          message:
            "No supported technical skills were detected in this job description.",
        },
        { status: 422 }
      );
    }

    const resumeSkills = new Set(
      resume.skills.map((skill) =>
        skill.toLowerCase().trim()
      )
    );

    const results: SkillResult[] =
      requiredSkills.map((skill) => {
        const normalizedSkill =
          skill.toLowerCase().trim();

        let status: SkillStatus =
          "missing";

        // Exact match
        if (
          resumeSkills.has(
            normalizedSkill
          )
        ) {
          status = "matched";
        } else {
          // Partial match
          const relatedSkills =
            PARTIAL_RELATIONSHIPS[
              skill
            ] || [];

          const hasPartialMatch =
            relatedSkills.some(
              (relatedSkill) =>
                resumeSkills.has(
                  relatedSkill
                    .toLowerCase()
                    .trim()
                )
            );

          if (hasPartialMatch) {
            status = "partial";
          }
        }

        return {
          skill,
          status,
          importance:
            status === "missing"
              ? "High"
              : "Medium",
          action:
            status === "matched"
              ? "Already covered"
              : status === "partial"
              ? "Improve"
              : "Learn Now",
        };
      });

    const matched = results.filter(
      (item) =>
        item.status === "matched"
    ).length;

    const partial = results.filter(
      (item) =>
        item.status === "partial"
    ).length;

    const missing = results.filter(
      (item) =>
        item.status === "missing"
    ).length;

    const readinessScore =
      requiredSkills.length === 0
        ? 0
        : Math.round(
            ((matched + partial * 0.5) /
              requiredSkills.length) *
              100
          );

    return NextResponse.json(
      {
        message:
          "Custom job description analyzed successfully.",

        resume: {
          id: resume._id.toString(),
          fileName: resume.fileName,
          skills: resume.skills,
        },

        jobDescription: {
          characterCount:
            description.length,
          detectedSkills:
            requiredSkills,
        },

        summary: {
          totalSkills:
            requiredSkills.length,
          matched,
          partial,
          missing,
          readinessScore,
        },

        skills: results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "CUSTOM_JD_ANALYSIS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Something went wrong while analyzing the job description.",
      },
      { status: 500 }
    );
  }
}