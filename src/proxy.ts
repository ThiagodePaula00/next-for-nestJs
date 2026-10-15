import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  const isGetRequest = request.method === 'GET';

  const shouldBeAuthenticated = isAdminPage;
  const shouldRedirect = shouldBeAuthenticated && isGetRequest;

  if (!shouldRedirect) {
    return NextResponse.next();
  }

  const jwtSession = request.cookies.get(
    process.env.LOGIN_COOKIE_NAME || 'loginSession',
  )?.value;

  const isAuthenticated = Boolean(jwtSession);

  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};