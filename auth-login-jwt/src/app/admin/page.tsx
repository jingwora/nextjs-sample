// nextjs/auth/src/app/admin/pages.tsx

"use client";

import { logout } from "../login/actions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Define the expected structure of the session data
type SessionData = {
  email: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch session data to display the user's email
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/session");
        if (res.ok) {
          const data: SessionData = await res.json();
          setUserEmail(data.email);
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
    await logout();
    router.push("/login");
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-lg mb-4">Welcome, {userEmail}!</p>
      <button
        onClick={goToDashboard}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Dashboard
      </button>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Logout
      </button>
    </div>
  );
}
