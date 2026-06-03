import { NextResponse } from 'next/server';

import { createPendingRegistration } from '../../../../../lib/server/auth-store';
import { sendOtpMail } from '../../../../../lib/server/mailer';

export async function POST(request: Request) {
  const body = (await request.json()) as {
    heroName?: string;
    email?: string;
    password?: string;
  };

  if (!body.heroName || !body.email || !body.password) {
    return NextResponse.json(
      { ok: false, message: 'Hero name, email, and password are required.' },
      { status: 400 }
    );
  }

  const result = createPendingRegistration(body.heroName, body.email, body.password);
  const mailResult = await sendOtpMail({
    to: body.email,
    heroName: body.heroName,
    otp: result.otp
  });

  return NextResponse.json({
    ok: true,
    message: 'OTP sent successfully.',
    preview: mailResult.messageId ?? null,
    expiresAt: result.expiresAt
  });
}