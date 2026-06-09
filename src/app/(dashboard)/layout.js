"use client";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-56 relative">
        <Navbar />
        <main className="p-10 pt-28">
          {children}
        </main>
      </div>
    </div>
  );
}
