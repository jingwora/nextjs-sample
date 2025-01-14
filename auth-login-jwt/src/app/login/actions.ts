// nextjs/auth/src/app/login/actions.ts

"use server";

import { z } from "zod";
import { createSession, deleteSession } from "../lib/session";

// Mock user data for validation
const testUsers = [
  { id: "1", email: "user1@email.com", password: "1234" },
  { id: "2", email: "user2@email.com", password: "1234" },
];

// Schema for validating the login form data
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" })
    .trim(),
});

// Define a type for the form errors
type FormErrors = {
  email?: string[];
  password?: string[];
};

// Define the type for the prevState parameter if required
type PrevState = Record<string, unknown>;

// Login function with refined types
export async function login(prevState: PrevState, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors as FormErrors,
      success: false,
    };
  }

  const { email, password } = result.data;

  // Find the user matching the email and password
  const user = testUsers.find((u) => u.email === email && u.password === password);

  if (!user) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
      success: false,
    };
  }

  // Pass user id and email to createSession
  await createSession(user.id, user.email);

  return { success: true, errors: {} };
}

// Logout function
export async function logout() {
  await deleteSession();
  return { success: true };
}
