import { NextRequest, NextResponse } from 'next/server';

const routeMap: Record<string, string> = {
  '/LANDING': '/',
  '/Dashboard': '/dashboard',
  '/OTP-signup': '/otp-signup'
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const target = routeMap[pathname];

  if (target) {
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/LANDING', '/Dashboard', '/OTP-signup']
};