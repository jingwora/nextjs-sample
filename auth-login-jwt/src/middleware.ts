// nextjs/auth/src/middleware.ts

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

const protectedRoutes = ["/dashboard"];
const adminRoutes = ["/admin"]; // Define admin-specific routes
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const cookie = cookies().get("session")?.value;

  // Attempt to decrypt the session
  const session = cookie ? await decrypt(cookie) : null;

  // Restrict access to protected routes
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    if (!session?.userId) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  // Restrict access to admin routes
  if (adminRoutes.some((route) => path.startsWith(route))) {
    if (!session?.email || session.email !== "user2@email.com") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  // Redirect authenticated users away from public routes
  if (publicRoutes.some((route) => path.startsWith(route))) {
    if (session?.userId) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"], // Apply middleware to specified routes
};
