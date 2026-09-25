import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import connectDB from "../../../../lib/mongodb";
import Resume from "../../../../models/Resume";
import { analyzeResumeWithAI } from "../../../../lib/ai";

export const runtime = "nodejs";
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    await connectDB();

    const resume = await Resume.findOne({
      userId: user.userId,
    }).sort({ createdAt: -1 });

    if (!resume) {
      return NextResponse.json({
        userId: user.userId,
        resume: null,
      });
    }

    return NextResponse.json({
      userId: user.userId,
      resume: {
        id: resume._id.toString(),
        fileName: resume.fileName,
        status: resume.status,
        extractedTextLength:
          resume.extractedText?.length || 0,
      },
    });
  } catch (error) {
    console.error("DEBUG_RESUME_ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Debug failed.",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    await connectDB();

    const resume = await Resume.findOne({
      userId: user.userId,
      status: "completed",
    }).sort({ createdAt: -1 });

    if (!resume) {
      return NextResponse.json(
        {
          message:
            "No completed resume found. Please upload and analyze your resume first.",
        },
        { status: 404 }
      );
    }

    if (!resume.extractedText?.trim()) {
      return NextResponse.json(
        {
          message:
            "Resume text is empty. Please analyze the uploaded resume first.",
        },
        { status: 400 }
      );
    }

    const analysis = await analyzeResumeWithAI(
      resume.extractedText
    );

    return NextResponse.json({
      message: "AI resume analysis completed.",
      resume: {
        id: resume._id.toString(),
        fileName: resume.fileName,
      },
      analysis,
    });
  } catch (error) {
    console.error("AI_RESUME_ANALYSIS_ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "AI resume analysis failed.",
      },
      { status: 500 }
    );
  }
}