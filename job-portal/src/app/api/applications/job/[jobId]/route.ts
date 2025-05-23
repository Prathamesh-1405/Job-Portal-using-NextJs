/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Application from '@/models/Application';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: { jobId: string } }) {
  await connectDB();

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const decoded: any= jwt.verify(token, process.env.JWT_SECRET!)
  if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

  try {
    console.log(`[jobid]:${params.jobId}`)
    const applications = await Application.aggregate([
      {
        $match: { jobId: new mongoose.Types.ObjectId(params.jobId) },
      },
      {
        $lookup: {
          from: 'users',  // check your actual collection name if different
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          status: 1,
          createdAt: 1,
          'userDetails._id': 1,
          'userDetails.name': 1,
          'userDetails.email': 1,
        },
      },
    ]);

    return NextResponse.json({ applications }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
