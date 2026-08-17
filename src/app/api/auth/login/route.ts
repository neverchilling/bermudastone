import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please enter both your email and password.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const token = 'session_' + Buffer.from(normalizedEmail).toString('base64');

    const res = NextResponse.json({
      success: true,
      token,
      user: {
        email: normalizedEmail,
        name: 'Resident',
        role: 'tenant',
        unit: 'Unit A',
      },
    });

    // Set standard tenant cookies across all common naming patterns
    const cookieOptions = {
      httpOnly: false, // Allows both client and server reads
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    };

    res.cookies.set('tenant_token', token, cookieOptions);
    res.cookies.set('tenant_token', token, cookieOptions);
    res.cookies.set('auth_token', token, cookieOptions);
    res.cookies.set('user_role', 'tenant', cookieOptions);

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Login failed' }, { status: 500 });
  }
}
