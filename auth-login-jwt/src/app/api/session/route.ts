// nextjs/auth/src/app/api/session/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "../../lib/session";

export async function GET() {
  const sessionCookie = cookies().get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  const session = await decrypt(sessionCookie);

  if (!session || !session.email) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  return NextResponse.json({ email: session.email });
}
