/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Job from '@/models/Job'
import Application from '@/models/Application';
import jwt from 'jsonwebtoken'; // your token decoder util

export async function GET(req: Request) {
  await connectDB();

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

  try {
    // Get all jobs
    const jobs = await Job.find({});

    // Get all applications by the user
    const applications = await Application.find({ userId: decoded.userId });

    // Create a map of jobId to status
    const appliedJobsMap = new Map();
    applications.forEach(app => {
      appliedJobsMap.set(app.jobId.toString(), app.status);
    });

    // Combine jobs with application status (if applied)
    const jobsWithStatus = jobs.map(job => ({
      ...job.toObject(),
      applicationStatus: appliedJobsMap.get(job._id.toString()) || null,
    }));
    

    return NextResponse.json({ jobs: jobsWithStatus }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}