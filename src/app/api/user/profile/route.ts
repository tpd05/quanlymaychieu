import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/utils/auth';

export async function PUT(req: NextRequest) {
  try {
    // Get current user from token
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { fullName, email, avatar } = await req.json();

    // Get current user data from database
    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if email is already used by another user
    if (email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser && existingUser.id !== currentUser.userId) {
        return NextResponse.json(
          { message: 'Email đã được sử dụng bởi tài khoản khác' },
          { status: 400 }
        );
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.userId },
      data: {
        fullName,
        email,
        avatar,
      },
      select: {
        id: true,
        userID: true,
        fullName: true,
        email: true,
        avatar: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: 'Cập nhật thông tin thành công',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi cập nhật thông tin' },
      { status: 500 }
    );
  }
}
