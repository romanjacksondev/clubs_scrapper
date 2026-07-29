import { NextResponse } from 'next/server';
import { auth } from './auth';

export default auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL('/login', req.nextUrl);
    loginUrl.searchParams.set('callbackUrl', `${req.nextUrl.pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ['/scrape/:path*', '/clubs/:path*', '/leagues/:path*'],
};
