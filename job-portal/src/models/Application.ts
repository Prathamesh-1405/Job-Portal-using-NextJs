import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  status: 'pending' | 'selected' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    status: { type: String, enum: ['pending', 'selected', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

const Application: Model<IApplication> = mongoose.models.Application || mongoose.model<IApplication>('Application', applicationSchema);

export default Application;
