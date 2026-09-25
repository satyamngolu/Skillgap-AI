import mongoose, { Document, Model, Schema } from "mongoose";

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  mimeType: string;
  fileSize: number;
  fileData: Buffer;
  status: "uploaded" | "processing" | "completed" | "failed";
  extractedText: string;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    fileData: {
      type: Buffer,
      required: true,
    },

    status: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
    },

    extractedText: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Resume: Model<IResume> =
  mongoose.models.Resume ||
  mongoose.model<IResume>("Resume", ResumeSchema);

export default Resume;