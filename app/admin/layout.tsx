"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if we're in demo mode for styling adjustments
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token && token.includes("dummy")) {
      setIsDemoMode(true);
    }
  }, []);

  return (
    <div className={`flex min-h-screen flex-col ${isDemoMode ? "pt-9" : ""}`}>
      <AdminHeader />
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
}
