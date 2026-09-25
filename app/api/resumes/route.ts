import { NextResponse } from "next/server";

import connectDB from "../../../lib/mongodb";
import { getCurrentUser } from "../../../lib/auth";
import Resume from "../../../models/Resume";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: Request) {
  try {
    console.log("=== RESUME UPLOAD START ===");

    const user = await getCurrentUser();

    console.log("CURRENT USER:", user);

    if (!user) {
      return NextResponse.json(
        {
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("resume");

    console.log("FILE RECEIVED:", file instanceof File);

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          message: "Please upload a resume file.",
        },
        { status: 400 }
      );
    }

    console.log("FILE NAME:", file.name);
    console.log("FILE TYPE:", file.type);
    console.log("FILE SIZE:", file.size);

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          message: "Only PDF, DOC, and DOCX files are allowed.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message: "Resume must be smaller than 5 MB.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("BUFFER CREATED:", buffer.length);

    await connectDB();

    console.log("MONGODB CONNECTED");

    const resume = await Resume.create({
      userId: user.userId,
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      fileData: buffer,
      status: "uploaded",
      extractedText: "",
      skills: [],
    });

    console.log("RESUME CREATED:", resume._id.toString());

    return NextResponse.json(
      {
        message: "Resume uploaded successfully.",
        resume: {
          id: resume._id.toString(),
          fileName: resume.fileName,
          fileSize: resume.fileSize,
          status: resume.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("=== RESUME_UPLOAD_ERROR ===");
    console.error(error);

    return NextResponse.json(
      {
        message: "Resume upload failed.",
        error: error instanceof Error
          ? error.message
          : String(error),
      },
      { status: 500 }
    );
  }
}