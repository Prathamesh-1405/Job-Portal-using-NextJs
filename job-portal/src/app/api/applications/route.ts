import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Application from '@/models/Application';

export async function POST(req: Request) {
  await connectDB();
  const { userId, jobId } = await req.json();

  try {
    const application = await Application.create({
      userId,
      jobId,
      status: 'pending',
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to apply' }, { status: 500 });
  }
}
