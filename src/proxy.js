import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'dm_authenticated_role';
const OLD_AUTH_COOKIE_NAME = 'dm_authenticated';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  
  // Check for either the new role-based cookie or the old one during transition
  const isAuthenticated =
    !!request.cookies.get(AUTH_COOKIE_NAME)?.value ||
    request.cookies.get(OLD_AUTH_COOKIE_NAME)?.value === 'true';

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  if (pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
