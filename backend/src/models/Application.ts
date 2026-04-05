import mongoose, { Document, Schema } from "mongoose";
import { IApplication } from "../types";

export interface ApplicationDocument extends Document {
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  appliedDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const applicationSchema = new Schema<ApplicationDocument>(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ApplicationDocument>(
  "Application",
  applicationSchema
);