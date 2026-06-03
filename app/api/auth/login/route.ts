import { NextResponse } from 'next/server';

import { authenticateUser } from '../../../../lib/server/auth-store';

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };

  if (!body.email || !body.password) {
    return NextResponse.json({ ok: false, message: 'Email and password are required.' }, { status: 400 });
  }

  const result = authenticateUser(body.email, body.password);
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: result.message }, { status: 401 });
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