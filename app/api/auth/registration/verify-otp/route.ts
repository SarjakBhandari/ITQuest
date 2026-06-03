import { NextResponse } from 'next/server';

import { verifyPendingRegistration } from '../../../../../lib/server/auth-store';

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; code?: string };

  if (!body.email || !body.code) {
    return NextResponse.json({ ok: false, message: 'Email and OTP code are required.' }, { status: 400 });
  }

  const result = verifyPendingRegistration(body.email, body.code);
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: result.message,
    user: {
      heroName: result.user.heroName,
      email: result.user.email
    }
  });
}