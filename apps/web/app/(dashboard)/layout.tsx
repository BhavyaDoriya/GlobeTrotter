"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { getAuthToken } from "@/lib/api-client";

// Routes that can be accessed publicly without logging in
const PUBLIC_PATHS = ["/", "/search"];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith("/share/"));
    const token = getAuthToken();

    if (!isPublic && !token) {
      router.push("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [pathname, router]);

  if (checkingAuth && !PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith("/share/"))) {
    return (
      <div className="min-h-screen bg-[#E5F0EF] flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-3xl border-4 border-white shadow-xl text-center">
          <p className="text-[#4A7C77] font-bold text-sm">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5F0EF] relative">
      <Navbar />
      {children}
    </div>
  );
}