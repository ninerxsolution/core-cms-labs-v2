import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminBasePath } from "@/lib/config/admin";

/**
 * Middleware to protect admin routes and rewrite admin paths
 * 
 * This middleware:
 * 1. Rewrites /{ADMIN_BASE_PATH}/* to /_admin/* (internal route)
 * 2. Protects admin routes with session check
 * 
 * Note: We only check for session cookie here (lightweight check)
 * Full session validation happens in the layout (Server Component)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminBasePath = getAdminBasePath();

  // Skip middleware for login page to avoid redirect loop
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Check if this is an admin route
  const isAdminRoute = pathname.startsWith(`/${adminBasePath}`);

  if (isAdminRoute) {
    // Get session cookie (lightweight check only)
    const sessionId = request.cookies.get("sessionId")?.value;

    if (!sessionId) {
      // No session cookie, redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rewrite /{ADMIN_BASE_PATH}/* to /admin-internal/*
    // Example: /admin -> /admin-internal, /admin/pages -> /admin-internal/pages
    let rewritePath = pathname.replace(`/${adminBasePath}`, "/admin-internal");
    
    // Handle root admin path: /admin -> /admin-internal
    if (pathname === `/${adminBasePath}`) {
      rewritePath = "/admin-internal";
    }
    
    const url = request.nextUrl.clone();
    url.pathname = rewritePath;
    return NextResponse.rewrite(url);
  }

  // Not an admin route, continue
  return NextResponse.next();
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

