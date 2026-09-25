import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IRoadmapProgress extends Document {
  userId: mongoose.Types.ObjectId;
  roleName: string;
  completedSkills: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapProgressSchema =
  new Schema<IRoadmapProgress>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      roleName: {
        type: String,
        required: true,
        trim: true,
      },

      completedSkills: {
        type: [String],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

// One progress document per user + target role
RoadmapProgressSchema.index(
  {
    userId: 1,
    roleName: 1,
  },
  {
    unique: true,
  }
);

const RoadmapProgress: Model<IRoadmapProgress> =
  mongoose.models.RoadmapProgress ||
  mongoose.model<IRoadmapProgress>(
    "RoadmapProgress",
    RoadmapProgressSchema
  );

export default RoadmapProgress;