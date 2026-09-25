import { NextResponse } from "next/server";

import connectDB from "../../../lib/mongodb";
import { getCurrentUser } from "../../../lib/auth";
import { getJobRole } from "../../../lib/job-roles";
import RoadmapProgress from "../../../models/RoadmapProgress";
import Resume from "../../../models/Resume";
import User from "../../../models/User";

export const runtime = "nodejs";

type SkillStatus =
  | "matched"
  | "partial"
  | "missing";

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
};

export async function GET(request: Request) {
  try {
    console.log("===== PROGRESS API HIT =====");

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    let roleName =
      searchParams.get("role")?.trim() || "";

    await connectDB();

    // If role is not provided in URL,
    // read it from the logged-in user's profile.
    if (!roleName) {
      const userDocument =
        await User.findById(
          user.userId
        ).select("targetRole");

      roleName =
        userDocument?.targetRole?.trim() ||
        "AI/ML Engineer";
    }

    console.log("PROGRESS ROLE:", roleName);

    const role = getJobRole(roleName);

    if (!role) {
      return NextResponse.json(
        {
          message: `Invalid job role: ${roleName}`,
        },
        { status: 400 }
      );
    }

    // Latest completed resume
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

    const resumeSkills = new Set(
      resume.skills.map((skill) =>
        skill.toLowerCase().trim()
      )
    );

    // Determine gaps for selected role
    const roadmapSkills = role.skills
      .map((requiredSkill) => {
        const skillName =
          requiredSkill.name;

        let status: SkillStatus =
          "missing";

        // Exact match
        if (
          resumeSkills.has(
            skillName
              .toLowerCase()
              .trim()
          )
        ) {
          status = "matched";
        } else {
          // Partial match
          const relatedSkills =
            PARTIAL_RELATIONSHIPS[
              skillName
            ] || [];

          const hasPartialMatch =
            relatedSkills.some(
              (skill) =>
                resumeSkills.has(
                  skill
                    .toLowerCase()
                    .trim()
                )
            );

          if (hasPartialMatch) {
            status = "partial";
          }
        }

        return {
          skill: skillName,
          status,
          importance:
            requiredSkill.importance,
        };
      })
      .filter(
        (item) =>
          item.status === "missing" ||
          item.status === "partial"
      );

    // Load saved roadmap progress
    const savedProgress =
      await RoadmapProgress.findOne({
        userId: user.userId,
        roleName: role.name,
      }).lean();

    const completedSkills =
      savedProgress?.completedSkills || [];

    // Only count completed skills
    // that belong to this roadmap
    const roadmapSkillNames =
      roadmapSkills.map(
        (item) => item.skill
      );

    const validCompletedSkills =
      completedSkills.filter(
        (skill) =>
          roadmapSkillNames.includes(skill)
      );

    const remainingSkills =
      roadmapSkills
        .filter(
          (item) =>
            !validCompletedSkills.includes(
              item.skill
            )
        )
        .map((item) => ({
          skill: item.skill,
          status: item.status,
          importance:
            item.importance,
        }));

    const totalSteps =
      roadmapSkills.length;

    const completedSteps =
      validCompletedSkills.length;

    const remainingSteps =
      remainingSkills.length;

    const progressPercentage =
      totalSteps === 0
        ? 100
        : Math.round(
            (completedSteps /
              totalSteps) *
              100
          );

    console.log(
      "PROGRESS RESULT:",
      {
        role: role.name,
        totalSteps,
        completedSteps,
        remainingSteps,
        progressPercentage,
        completedSkills:
          validCompletedSkills,
      }
    );

    return NextResponse.json(
      {
        message:
          "Progress data fetched successfully.",

        role: {
          name: role.name,
          description:
            role.description,
        },

        resume: {
          id: resume._id.toString(),
          fileName: resume.fileName,
        },

        summary: {
          totalSteps,
          completedSteps,
          remainingSteps,
          progressPercentage,
        },

        completedSkills:
          validCompletedSkills,

        remainingSkills,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "PROGRESS_API_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to load progress data.",
      },
      { status: 500 }
    );
  }
}