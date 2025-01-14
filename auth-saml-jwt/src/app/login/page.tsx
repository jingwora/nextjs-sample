// nextjs/auth-saml-jwt/src/app/login/page.tsx

"use client";

import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  // Redirect user to SAML login flow
  const handleSamlLogin = async () => {
    try {
      // Redirect to the SAML login endpoint
      router.push("/api/auth/login");
    } catch (error) {
      console.error("Failed to initiate SAML login:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Log In</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to log in using SAML authentication.
        </p>
        <button
          onClick={handleSamlLogin}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Login with SAML
        </button>
      </div>
    </div>
  );
}
