import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Public routes that don't require authentication
    const publicRoutes = ["/auth/login", "/auth/register", "/"];
    const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

    // If it's a public route, allow access
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Check for session cookie instead of using Prisma in middleware
    // Better Auth uses different cookie names, let's check for any auth-related cookies
    const sessionCookie = request.cookies.get("better-auth.session_token") || 
                         request.cookies.get("better-auth.session") ||
                         request.cookies.get("session_token") ||
                         request.cookies.get("session");
    
    // If no session cookie and trying to access protected route, redirect to login
    if (!sessionCookie) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // If has session cookie and trying to access auth pages, redirect to dashboard
    if (sessionCookie && (request.nextUrl.pathname.startsWith("/auth"))) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // If there's an error, allow the request to proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
