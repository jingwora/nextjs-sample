// nextjs/auth-saml-jwt/src/middleware.ts

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

const protectedRoutes = ["/dashboard"];
const adminRoutes = ["/admin"];
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname;
    const cookie = cookies().get("session")?.value;
    
    console.log("Debug cookie", cookie);

    const session = cookie ? await decrypt(cookie) : null;

    console.log("Middleware invoked for path:", path);
    console.log("Decrypted session:", session);

    if (protectedRoutes.some((route) => path.startsWith(route))) {
      if (!session?.userId) {
        console.warn("Access denied to protected route. Redirecting to /login.");
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    if (adminRoutes.some((route) => path.startsWith(route))) {
      if (!session?.email || session.email !== "admin@example.com") {
        console.warn("Access denied to admin route. Redirecting to /dashboard.");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (publicRoutes.some((route) => path.startsWith(route))) {
      if (session?.userId) {
        console.info("Authenticated user accessing public route. Redirecting to /dashboard.");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
