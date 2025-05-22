import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
