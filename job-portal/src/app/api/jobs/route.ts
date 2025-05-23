/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Job from '@/models/Job';
import jwt from 'jsonwebtoken';
import Application from '@/models/Application';

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userRole = decoded.role;

    // const jobs = await Job.find();
    const appliedJobs = await Application.find({ userId: decoded.userId }).select('jobId');
    console.log(appliedJobs)
    const appliedJobIds = appliedJobs.map((app) => app.jobId);
    console.log(appliedJobIds)
    const jobs = await Job.find({
      status: 'active',
      _id: { $nin: appliedJobIds },
    });
    console.log(jobs)


    return NextResponse.json({ jobs, role: userRole });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching jobs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const job = await Job.create(body);

    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}