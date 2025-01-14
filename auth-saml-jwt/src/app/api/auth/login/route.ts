// nextjs/auth-saml-jwt/src/app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { generateAuthUrl } from "@/app/lib/saml";

export async function GET() {
  try {
    const loginUrl = await generateAuthUrl();
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate SAML login URL" },
      { status: 500 }
    );
  }
}
