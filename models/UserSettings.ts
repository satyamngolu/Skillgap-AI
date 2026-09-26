import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  emailNotifications: boolean;
  roadmapReminders: boolean;
  jobRecommendations: boolean;
  weeklyProgress: boolean;
  compactMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema = new Schema<IUserSettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    roadmapReminders: {
      type: Boolean,
      default: true,
    },

    jobRecommendations: {
      type: Boolean,
      default: true,
    },

    weeklyProgress: {
      type: Boolean,
      default: true,
    },

    compactMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserSettings: Model<IUserSettings> =
  mongoose.models.UserSettings ||
  mongoose.model<IUserSettings>("UserSettings", UserSettingsSchema);

export default UserSettings;