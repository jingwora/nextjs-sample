// nextjs/auth-saml-jwt/src/app/api/auth/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import { validateSamlResponse } from "@/app/lib/saml";
import { createSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawSamlResponse = formData.get("SAMLResponse") as string;

    if (!rawSamlResponse) {
      console.error("SAMLResponse is missing in the request.");
      return NextResponse.json(
        { error: "SAMLResponse is missing in the request" },
        { status: 400 }
      );
    }

    console.log("Received raw SAMLResponse");

    // Validate and parse the SAML response
    const profile = await validateSamlResponse(rawSamlResponse);

    if (!profile) {
      console.error("Failed to validate SAML response. Profile is null.");
      return NextResponse.json(
        { error: "Invalid SAML response." },
        { status: 400 }
      );
    }

    // Ensure required attributes are present
    const userId = profile.nameID || "unknown-user";
    const email = profile.email || profile.attributes?.email || "unknown-email";

    // Log extracted fields for debugging
    console.log("Extracted SAML Profile:", {
      userId,
      email,
      attributes: profile.attributes,
    });

    // Create a session using the extracted user information
    await createSession(userId, email); // Call createSession to set the session cookie

  } catch (error) {
    console.error("Error processing SAML response:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `SAML response processing failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process SAML response" },
      { status: 500 }
    );
  }
  return redirect("/dashboard");
}
