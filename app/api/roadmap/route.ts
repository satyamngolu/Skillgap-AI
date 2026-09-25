import { NextResponse } from "next/server";
import { getLearningResources } from "../../../lib/learning-resources";
import connectDB from "../../../lib/mongodb";
import { getCurrentUser } from "../../../lib/auth";
import { getJobRole } from "../../../lib/job-roles";
import { getRoadmapSkill } from "../../../lib/roadmap";
import Resume from "../../../models/Resume";

export const runtime = "nodejs";

type SkillStatus = "matched" | "partial" | "missing";

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

const PRIORITY_ORDER = {
  High: 0,
  Medium: 1,
  Low: 2,
};

export async function GET(request: Request) {
  try {
    // Check logged-in user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    // Read role from URL
    const { searchParams } =
      new URL(request.url);

    const roleName =
      searchParams.get("role") ||
      "AI/ML Engineer";

    console.log(
      "ROADMAP API ROLE:",
      roleName
    );

    // Find selected role
    const role = getJobRole(roleName);

    if (!role) {
      return NextResponse.json(
        {
          message: "Invalid job role.",
        },
        { status: 400 }
      );
    }

    // Connect MongoDB
    await connectDB();

    // Get latest analyzed resume
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

    // Normalize resume skills
    const resumeSkills = new Set(
      resume.skills.map((skill) =>
        skill.toLowerCase().trim()
      )
    );

    // Find missing and partial skills
    const roadmapSkills = role.skills
      .map((requiredSkill) => {
        const skillName = requiredSkill.name;

        const normalizedSkill =
          skillName.toLowerCase().trim();

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
          const partialSkills =
            PARTIAL_RELATIONSHIPS[
              skillName
            ] || [];

          const hasPartialMatch =
            partialSkills.some((skill) =>
              resumeSkills.has(
                skill.toLowerCase().trim()
              )
            );

          if (hasPartialMatch) {
            status = "partial";
          }
        }

        return {
          ...requiredSkill,
          status,
        };
      })
      // Roadmap only contains gaps
      .filter(
        (skill) =>
          skill.status === "missing" ||
          skill.status === "partial"
      );

    // Sort:
    // High priority first
    // Missing before partial
    // Then alphabetical
    roadmapSkills.sort((a, b) => {
      const priorityDifference =
        PRIORITY_ORDER[
          a.importance
        ] -
        PRIORITY_ORDER[
          b.importance
        ];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      if (a.status !== b.status) {
        return a.status === "missing"
          ? -1
          : 1;
      }

      return a.name.localeCompare(
        b.name
      );
    });

    // Build detailed roadmap
   const roadmap = roadmapSkills.map(
  (skill, index) => {
    const details =
      getRoadmapSkill(skill.name);

    return {
      order: index + 1,
      skill: skill.name,
      status: skill.status,
      importance: skill.importance,
      level: details.level,
      duration: details.duration,
      topics: details.topics,
      project: details.project,

      resources: getLearningResources(
        skill.name
      ),
    };
  }
);
    // Estimate total learning days
    const estimatedDays =
      roadmap.reduce(
        (total, item) => {
          const amount = parseInt(
            item.duration,
            10
          );

          if (
            item.duration.includes(
              "week"
            )
          ) {
            return total + amount * 7;
          }

          if (
            item.duration.includes(
              "day"
            )
          ) {
            return total + amount;
          }

          return total;
        },
        0
      );

    console.log(
      "ROADMAP GENERATED:",
      {
        role: role.name,
        totalSteps:
          roadmap.length,
      }
    );

    return NextResponse.json(
      {
        message:
          "Personalized roadmap generated successfully.",

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
          totalSteps:
            roadmap.length,

          missingSkills:
            roadmap.filter(
              (item) =>
                item.status ===
                "missing"
            ).length,

          partialSkills:
            roadmap.filter(
              (item) =>
                item.status ===
                "partial"
            ).length,

          estimatedDays,
        },

        roadmap,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "ROADMAP_API_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Something went wrong while generating the roadmap.",
      },
      {
        status: 500,
      }
    );
  }
}