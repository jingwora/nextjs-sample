// nextjs/auth/src/app/admin/pages.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Define the expected structure of the session data
type SessionData = {
  email: string;
  expiresAt: string; // Add the expiresAt property
};

export default function AdminPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<string | null>(null); // State for expiresAt
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch session data to display the user's email and expiresAt
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/session");
        if (res.ok) {
          const data: SessionData = await res.json();
          setUserEmail(data.email);
          setSessionExpiresAt(data.expiresAt); // Set expiresAt from session
        } else {
          console.error("Failed to fetch session");
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
    setIsLoggingOut(false);
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-lg mb-4">
        {userEmail ? `Welcome, ${userEmail}!` : "Loading..."}
      </p>
      {sessionExpiresAt && (
        <p className="text-lg mb-4">
          Session Expires At: {new Date(sessionExpiresAt).toLocaleString()}
        </p>
      )}
      <button
        onClick={goToDashboard}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Dashboard
      </button>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
