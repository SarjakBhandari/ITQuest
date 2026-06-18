import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const SESSION_COOKIE = 'itquest_token';
const protectedPaths = ['/dashboard', '/quests'];

const routeMap: Record<string, string> = {
  '/LANDING': '/',
  '/Dashboard': '/dashboard',
  '/OTP-signup': '/otp-signup'
};

function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const secret = process.env.JWT_SECRET;
  if (!secret) return Boolean(token);

  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const legacyTarget = routeMap[pathname];
  if (legacyTarget) {
    return NextResponse.redirect(new URL(legacyTarget, request.url));
  }

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtected && !hasValidSession(request)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/LANDING', '/Dashboard', '/OTP-signup', '/dashboard/:path*', '/quests/:path*']
};
