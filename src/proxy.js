import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/all-prompts", "/login", "/register"];

  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/prompts"];

  // Role-based protected routes
  const creatorRoutes = ["/dashboard/creator"];
  const adminRoutes = ["/dashboard/admin"];

  // Check if user is authenticated for protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Check role-based access for creator routes
  if (creatorRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.user.role !== "creator" && session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Check role-based access for admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
