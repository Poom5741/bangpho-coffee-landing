import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // TODO: Integrate with Resend API
    // For now, just return success
    // In production, you would:
    // 1. Get RESEND_API_KEY from environment variables
    // 2. Call Resend API to send confirmation email or add to audience
    // 3. Handle API errors appropriately

    console.log('Signup received:', email);

    return NextResponse.json(
      { success: true, message: 'Signup successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
