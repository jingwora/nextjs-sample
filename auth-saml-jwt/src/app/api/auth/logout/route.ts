// nextjs/auth-saml-jwt/src/app/api/auth/logout/route.ts

import { NextResponse } from "next/server";
import { deleteSession } from "@/app/lib/session";

export async function POST() {
  try {
    // Clear the session
    deleteSession();

    // Respond with a success message
    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error) {
    console.error("Logout failed:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
