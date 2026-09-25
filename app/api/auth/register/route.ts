import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "Name, email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          message: "Password must be at least 8 characters.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
  console.error("REGISTER_ERROR:", error);

  return NextResponse.json(
    {
      message: "Registration failed",
      error: error instanceof Error ? error.message : String(error),
    },
    {
      status: 500,
    }
  );
}
}