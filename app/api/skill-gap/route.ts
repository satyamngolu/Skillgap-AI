import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { getCurrentUser } from "../../../lib/auth";
import Resume from "../../../models/Resume";
import {
  getJobRole,
  RequiredSkill,
} from "../../../lib/job-roles";

export const runtime = "nodejs";

type SkillStatus = "matched" | "partial" | "missing";

type SkillResult = {
  skill: string;
  status: SkillStatus;
  importance: RequiredSkill["importance"];
  action: string;
};

const PARTIAL_RELATIONSHIPS: Record<string, string[]> = {
  "Deep Learning": ["Machine Learning"],
  PyTorch: ["Python", "Deep Learning"],
  TensorFlow: ["Python", "Deep Learning"],
  "MLOps": ["Docker", "Machine Learning"],
  FastAPI: ["Python", "REST API"],
  Docker: ["Git"],
  AWS: ["Docker"],
  "REST API": ["JavaScript", "Node.js", "Python"],
};

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase();
}

function getSkillStatus(
  requiredSkill: string,
  userSkills: string[]
): SkillStatus {
  const normalizedRequired = normalizeSkill(requiredSkill);

  const exactMatch = userSkills.some(
    (skill) => normalizeSkill(skill) === normalizedRequired
  );

  if (exactMatch) {
    return "matched";
  }

  const relatedSkills =
    PARTIAL_RELATIONSHIPS[requiredSkill] ?? [];

  const partialMatch = relatedSkills.some((relatedSkill) =>
    userSkills.some(
      (userSkill) =>
        normalizeSkill(userSkill) ===
        normalizeSkill(relatedSkill)
    )
  );

  return partialMatch ? "partial" : "missing";
}

function getWeight(
  importance: RequiredSkill["importance"]
): number {
  switch (importance) {
    case "High":
      return 3;
    case "Medium":
      return 2;
    case "Low":
      return 1;
  }
}

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);

    const roleName =
      searchParams.get("role") || "AI/ML Engineer";

    const role = getJobRole(roleName);

    if (!role) {
      return NextResponse.json(
        {
          message: `Job role "${roleName}" was not found.`,
        },
        { status: 404 }
      );
    }

    await connectDB();

    const resume = await Resume.findOne({
      userId: user.userId,
      status: "completed",
    }).sort({
      createdAt: -1,
    });

    if (!resume) {
      return NextResponse.json(
        {
          message:
            "Please upload and analyze your resume first.",
        },
        { status: 404 }
      );
    }

    const userSkills: string[] = Array.isArray(resume.skills)
      ? resume.skills
      : [];

    const results: SkillResult[] = role.skills.map(
      (requiredSkill) => {
        const status = getSkillStatus(
          requiredSkill.name,
          userSkills
        );

        return {
          skill: requiredSkill.name,
          status,
          importance: requiredSkill.importance,
          action:
            status === "matched"
              ? "—"
              : status === "partial"
                ? "Improve"
                : "Learn Now",
        };
      }
    );

    const matched = results.filter(
      (item) => item.status === "matched"
    );

    const partial = results.filter(
      (item) => item.status === "partial"
    );

    const missing = results.filter(
      (item) => item.status === "missing"
    );

    const totalWeight = results.reduce(
      (sum, item) => sum + getWeight(item.importance),
      0
    );

    const achievedWeight = results.reduce(
      (sum, item) => {
        if (item.status === "matched") {
          return sum + getWeight(item.importance);
        }

        if (item.status === "partial") {
          return sum + getWeight(item.importance) * 0.5;
        }

        return sum;
      },
      0
    );

    const readinessScore =
      totalWeight === 0
        ? 0
        : Math.round(
            (achievedWeight / totalWeight) * 100
          );

    return NextResponse.json(
      {
        message: "Skill gap analysis generated successfully.",

        role: {
          name: role.name,
          description: role.description,
        },

        resume: {
          id: resume._id.toString(),
          fileName: resume.fileName,
          skills: userSkills,
        },

        summary: {
          totalSkills: results.length,
          matched: matched.length,
          partial: partial.length,
          missing: missing.length,
          readinessScore,
        },

        skills: results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("SKILL_GAP_ERROR:", error);

    return NextResponse.json(
      {
        message:
          "Something went wrong while generating skill gap analysis.",
      },
      { status: 500 }
    );
  }
}