import mongoose, { Document, Model, Schema } from 'mongoose';
type JobStatus = 'active' | 'inactive';
export interface IJob extends Document {
  _id: string;
  companyName: string;
  role: string;
  type: 'full time' | 'part time' | 'remote';
  salaryRange: string;
  skillsRequired: string[];
  description?: string;
  status: JobStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const jobSchema = new Schema<IJob>(
  {
    companyName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    type: { type: String, enum: ['full time', 'part time', 'remote'], required: true },
    salaryRange: { type: String, required: true },
    skillsRequired: [{ type: String, required: true }],
    description: { type: String },
     status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  
  
  { timestamps: true }
);

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);

export default Job;
