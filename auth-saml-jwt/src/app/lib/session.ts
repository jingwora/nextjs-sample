
// nextjs/auth/src/app/lib/session.ts

import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = "2892";
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string, email: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  console.log("Debug encodedKey 1", encodedKey)
  const session = await encrypt({ userId, email, expiresAt });

  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
}

export async function deleteSession() {
  cookies().delete("session");
}

type SessionPayload = {
  userId: string;
  email: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  console.log("Debug encodedKey 2", encodedKey)
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined): Promise<SessionPayload | null> {
  console.log("Debug encodedKey 3", encodedKey)
  try {
    if (!session) {
      console.error("No session token provided for decryption.");
      return null;
    }

    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    // Assert payload matches SessionPayload
    return payload as SessionPayload;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to verify session:", error.message);
    } else {
      console.error("An unknown error occurred during session verification.");
    }
    return null;
  }
}
