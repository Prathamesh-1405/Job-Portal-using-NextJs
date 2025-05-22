import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'jobseeker' | 'admin';
  mobileNo: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['jobseeker', 'admin'], default: 'jobseeker' },
    mobileNo: { type: String, required: true },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
