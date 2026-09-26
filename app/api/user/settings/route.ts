import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import connectDB from "../../../../lib/mongodb";
import UserSettings from "../../../../models/UserSettings";

export const runtime = "nodejs";

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  roadmapReminders: true,
  jobRecommendations: true,
  weeklyProgress: true,
  compactMode: false,
};

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    await connectDB();

    let settings = await UserSettings.findOne({
      userId: sessionUser.userId,
    });

    if (!settings) {
      settings = await UserSettings.create({
        userId: sessionUser.userId,
        ...DEFAULT_SETTINGS,
      });
    }

    return NextResponse.json({
      settings: {
        emailNotifications: settings.emailNotifications,
        roadmapReminders: settings.roadmapReminders,
        jobRecommendations: settings.jobRecommendations,
        weeklyProgress: settings.weeklyProgress,
        compactMode: settings.compactMode,
      },
    });
  } catch (error) {
    console.error("SETTINGS_GET_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to load settings." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    const updates: Record<string, boolean> = {};

    const allowedFields = [
      "emailNotifications",
      "roadmapReminders",
      "jobRecommendations",
      "weeklyProgress",
      "compactMode",
    ];

    for (const field of allowedFields) {
      if (typeof body[field] === "boolean") {
        updates[field] = body[field];
      }
    }

    const settings = await UserSettings.findOneAndUpdate(
      { userId: sessionUser.userId },
      {
        $set: updates,
        $setOnInsert: {
          userId: sessionUser.userId,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      message: "Settings updated successfully.",
      settings: {
        emailNotifications: settings.emailNotifications,
        roadmapReminders: settings.roadmapReminders,
        jobRecommendations: settings.jobRecommendations,
        weeklyProgress: settings.weeklyProgress,
        compactMode: settings.compactMode,
      },
    });
  } catch (error) {
    console.error("SETTINGS_UPDATE_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update settings." },
      { status: 500 }
    );
  }
}