import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import { getCurrentUser } from "../../../../../lib/auth";
import { extractPdfText } from "../../../../../lib/resume-parser";
import { extractSkills } from "../../../../../lib/skill-extractor";
import Resume from "../../../../../models/Resume";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    console.log("=== RESUME ANALYSIS START ===");

    const user = await getCurrentUser();

    console.log("CURRENT USER:", user);

    if (!user) {
      return NextResponse.json(
        {
          message: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;

    console.log("RESUME ID:", id);

    await connectDB();

    console.log("MONGODB CONNECTED");

    const resume = await Resume.findOne({
      _id: id,
      userId: user.userId,
    });

    if (!resume) {
      return NextResponse.json(
        {
          message: "Resume not found.",
        },
        {
          status: 404,
        }
      );
    }

    console.log("RESUME FOUND:", resume.fileName);

    if (resume.mimeType !== "application/pdf") {
      return NextResponse.json(
        {
          message:
            "PDF analysis is available now. DOC and DOCX extraction will be added next.",
        },
        {
          status: 400,
        }
      );
    }

    resume.status = "processing";
    await resume.save();

    console.log("STARTING PDF EXTRACTION...");

    const extractedText = await extractPdfText(
      resume.fileData
    );

    console.log(
      "TEXT EXTRACTED:",
      extractedText.length
    );

    if (!extractedText) {
      resume.status = "failed";
      await resume.save();

      return NextResponse.json(
        {
          message:
            "No readable text was found in this PDF.",
        },
        {
          status: 422,
        }
      );
    }

    const skills = extractSkills(extractedText);

    console.log("SKILLS FOUND:", skills);

    resume.extractedText = extractedText;
    resume.skills = skills;
    resume.status = "completed";

    await resume.save();

    console.log("=== RESUME ANALYSIS COMPLETE ===");

    return NextResponse.json(
      {
        message:
          "Resume analyzed successfully.",
        resume: {
          id: resume._id.toString(),
          fileName: resume.fileName,
          status: resume.status,
          textLength: extractedText.length,
          extractedText,
          skills,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "=== RESUME_ANALYZE_ERROR ==="
    );
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Something went wrong while analyzing the resume.",
      },
      {
        status: 500,
      }
    );
  }
}