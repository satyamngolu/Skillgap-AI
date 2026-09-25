import { NextResponse } from "next/server";

import { getCurrentUser } from "../../../lib/auth";
import { getRoadmapSkill } from "../../../lib/roadmap";
import { getLearningResources } from "../../../lib/learning-resources";

export const runtime = "nodejs";

type SkillInput = {
  skill: string;
  status: "missing" | "partial";
  importance: "High" | "Medium";
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

    const skills = body.skills as SkillInput[];

    if (!Array.isArray(skills)) {
      return NextResponse.json(
        {
          message: "Skills are required.",
        },
        { status: 400 }
      );
    }

    const roadmap = skills
      .filter(
        (item) =>
          item.status === "missing" ||
          item.status === "partial"
      )
      .map((item, index) => {
        const details =
          getRoadmapSkill(item.skill);

        return {
          order: index + 1,
          skill: item.skill,
          status: item.status,
          importance: item.importance,
          level: details.level,
          duration: details.duration,
          topics: details.topics,
          project: details.project,
          resources:
            getLearningResources(item.skill),
        };
      });

    const estimatedDays =
      roadmap.reduce(
        (total, item) => {
          const value = parseInt(
            item.duration,
            10
          );

          if (
            item.duration.includes("week")
          ) {
            return total + value * 7;
          }

          if (
            item.duration.includes("day")
          ) {
            return total + value;
          }

          return total;
        },
        0
      );

    return NextResponse.json(
      {
        message:
          "Custom roadmap generated successfully.",

        summary: {
          totalSteps: roadmap.length,
          estimatedDays,
        },

        roadmap,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "CUSTOM_ROADMAP_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to generate custom roadmap.",
      },
      { status: 500 }
    );
  }
}