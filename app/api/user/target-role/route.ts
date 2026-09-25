import { NextResponse } from "next/server";

import connectDB from "../../../../lib/mongodb";
import { getCurrentUser } from "../../../../lib/auth";
import User from "../../../../models/User";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        {
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const targetRole = body.targetRole;

    if (
      typeof targetRole !== "string" ||
      !targetRole.trim()
    ) {
      return NextResponse.json(
        {
          message: "Target role is required.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.userId,
      {
        targetRole: targetRole.trim(),
      },
      {
        new: true,
      }
    ).select("name email targetRole");

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Target role saved successfully.",
        targetRole: user.targetRole,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "TARGET_ROLE_UPDATE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to save target role.",
      },
      { status: 500 }
    );
  }
}