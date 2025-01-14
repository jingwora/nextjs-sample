// nextjs/auth/src/app/dashboard/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Define the expected structure of the session data
type SessionData = {
  email: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch session data to get the user's email
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/session");
        if (res.ok) {
          const data: SessionData = await res.json(); // Use SessionData type
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

  const goToAdminPage = () => {
    if (userEmail === "admin@example.com") {
      router.push("/admin");
    } else {
      alert("You do not have access to the Admin Page."); // Show an alert
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
      {userEmail && <p className="text-lg mb-4">Welcome, {userEmail}!</p>}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={goToAdminPage}
      >
        Go to Admin Page
      </button>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
