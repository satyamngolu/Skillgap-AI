import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/User";

export const runtime = "nodejs";

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

    const user = await User.findById(sessionUser.userId).select(
      "-passwordHash"
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        targetRole: user.targetRole || "",
        education: user.education || "",
        experience: user.experience || "",
        skills: user.skills || [],
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("PROFILE_GET_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to load profile." },
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

    const updates: {
      name?: string;
      targetRole?: string;
      education?: string;
      experience?: string;
      skills?: string[];
    } = {};

    if (typeof body.name === "string") {
      updates.name = body.name.trim();
    }

    if (typeof body.targetRole === "string") {
      updates.targetRole = body.targetRole.trim();
    }

    if (typeof body.education === "string") {
      updates.education = body.education.trim();
    }

    if (typeof body.experience === "string") {
      updates.experience = body.experience.trim();
    }

    if (Array.isArray(body.skills)) {
      updates.skills = body.skills
        .filter((skill: unknown) => typeof skill === "string")
        .map((skill: string) => skill.trim())
        .filter(Boolean);
    }

    if (updates.name !== undefined && !updates.name) {
      return NextResponse.json(
        { message: "Name cannot be empty." },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      sessionUser.userId,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-passwordHash");

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        targetRole: user.targetRole || "",
        education: user.education || "",
        experience: user.experience || "",
        skills: user.skills || [],
      },
    });
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update profile." },
      { status: 500 }
    );
  }
}