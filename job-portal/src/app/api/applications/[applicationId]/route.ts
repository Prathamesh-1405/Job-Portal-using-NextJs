import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Application from '@/models/Application';
import jwt from 'jsonwebtoken';

export async function PUT(req: Request, { params }: { params: { applicationId: string } }) {
  await connectDB();

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

  try {
    const { status } = await req.json();

    if (!['selected', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    await Application.findByIdAndUpdate(params.applicationId, { status });

    return NextResponse.json({ message: 'Status updated' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
