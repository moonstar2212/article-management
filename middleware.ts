import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is public
  const isPublicPath =
    path === "/auth/login" || path === "/auth/register" || path === "/";

  // Get token from cookies
  const token = request.cookies.get("token")?.value || "";
  const userJson = request.cookies.get("user")?.value || "";

  // If the user is not authenticated and the path is not public, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If the user is authenticated and the path is public, redirect to appropriate dashboard
  if (token && isPublicPath) {
    try {
      const user = userJson ? JSON.parse(decodeURIComponent(userJson)) : null;
      if (user && user.role === "admin") {
        return NextResponse.redirect(new URL("/admin/articles", request.url));
      } else {
        return NextResponse.redirect(new URL("/user/articles", request.url));
      }
    } catch (error) {
      // If there's an error parsing the user, clear cookies and redirect to login
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("token");
      response.cookies.delete("user");
      return response;
    }
  }

  // Check role-based access
  if (token && userJson) {
    try {
      const user = JSON.parse(decodeURIComponent(userJson));

      // Admin routes should only be accessible by admins
      if (path.includes("/admin") && user.role !== "admin") {
        return NextResponse.redirect(new URL("/user/articles", request.url));
      }

      // User routes should only be accessible by regular users
      if (path.includes("/user") && user.role !== "user") {
        return NextResponse.redirect(new URL("/admin/articles", request.url));
      }
    } catch (error) {
      // If there's an error parsing the user, clear cookies and redirect to login
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("token");
      response.cookies.delete("user");
      return response;
    }
  }

  return NextResponse.next();
}

// Define which paths this middleware should run for
export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/auth/login",
    "/auth/register",
    "/",
  ],
};
