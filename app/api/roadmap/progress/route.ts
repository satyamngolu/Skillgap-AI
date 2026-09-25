import { NextResponse } from "next/server";

import connectDB from "../../../../lib/mongodb";
import { getCurrentUser } from "../../../../lib/auth";
import RoadmapProgress from "../../../../models/RoadmapProgress";

export const runtime = "nodejs";

// GET SAVED PROGRESS
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const roleName =
      searchParams.get("role") || "AI/ML Engineer";

    await connectDB();

    const progress = await RoadmapProgress.findOne({
      userId: user.userId,
      roleName: roleName.trim(),
    }).lean();

    return NextResponse.json(
      {
        roleName,
        completedSkills:
          progress?.completedSkills || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET_PROGRESS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to load progress.",
      },
      { status: 500 }
    );
  }
}

// PUT / SAVE PROGRESS
export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const roleName =
      typeof body.roleName === "string"
        ? body.roleName.trim()
        : "";

    const skill =
      typeof body.skill === "string"
        ? body.skill.trim()
        : "";

    const completed = body.completed;

    console.log("===== SAVE PROGRESS =====");
    console.log("User ID:", user.userId);
    console.log("Role:", roleName);
    console.log("Skill:", skill);
    console.log("Completed:", completed);

    if (!roleName) {
      return NextResponse.json(
        {
          message: "roleName is required.",
        },
        { status: 400 }
      );
    }

    if (!skill) {
      return NextResponse.json(
        {
          message: "skill is required.",
        },
        { status: 400 }
      );
    }

    if (typeof completed !== "boolean") {
      return NextResponse.json(
        {
          message:
            "completed must be true or false.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    let progress =
      await RoadmapProgress.findOne({
        userId: user.userId,
        roleName,
      });

    // Create document if it does not exist
    if (!progress) {
      progress = new RoadmapProgress({
        userId: user.userId,
        roleName,
        completedSkills: [],
      });
    }

    // Make sure array exists
    if (!Array.isArray(progress.completedSkills)) {
      progress.completedSkills = [];
    }

    // MARK COMPLETE
    if (completed === true) {
      if (
        !progress.completedSkills.includes(skill)
      ) {
        progress.completedSkills.push(skill);
      }
    }

    // MARK INCOMPLETE
    if (completed === false) {
      progress.completedSkills =
        progress.completedSkills.filter(
          (savedSkill) =>
            savedSkill !== skill
        );
    }

    await progress.save();

    console.log(
      "SAVED COMPLETED SKILLS:",
      progress.completedSkills
    );

    return NextResponse.json(
      {
        message:
          "Roadmap progress saved successfully.",

        roleName: progress.roleName,

        completedSkills:
          progress.completedSkills,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "PUT_PROGRESS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to save roadmap progress.",
      },
      { status: 500 }
    );
  }
}