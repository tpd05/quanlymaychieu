import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwtToken } from '@/lib/jwt';
import { hashPassword } from '@/lib/bcrypt';
import { generateUserID } from '@/utils/generateUserID';

export async function POST(req: NextRequest) {
  try {
    // Verify admin token
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    if (!decoded || typeof decoded === 'string' || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { fullName, email, password, role, isActive } = await req.json();

    // Validate required fields (userID is now auto-generated)
    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }

    // Generate unique userID
    const userID = await generateUserID();

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        userID,
        fullName,
        email,
        password: hashedPassword,
        role,
        isActive: isActive !== undefined ? isActive : true,
      },
      select: {
        id: true,
        userID: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
