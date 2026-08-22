import React from "react";
import Navbar from "../../components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#E5F0EF] relative">
      <Navbar />
      {/* This renders whatever page you are currently on */}
      {children}
    </div>
  );
}