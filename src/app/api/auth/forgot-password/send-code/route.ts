import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verificationCodes, generateVerificationCode } from '@/lib/verification';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists with this email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Email không tồn tại trong hệ thống' },
        { status: 404 }
      );
    }

    // Generate verification code
    const code = generateVerificationCode();
    const expires = Date.now() + 60000; // 1 minute

    // Store code
    verificationCodes.set(email, { code, expires });

    // For development mode: return code directly (REMOVE IN PRODUCTION)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Verification code for ${email}: ${code}`);
      return NextResponse.json({
        message: 'Mã xác thực đã được tạo (Development mode)',
        email,
        code, // Only for development testing
      });
    }

    // TODO: In production, send email using nodemailer or email service
    // For now, just return success
    return NextResponse.json({
      message: 'Mã xác thực đã được gửi đến email của bạn',
      email,
    });
  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
