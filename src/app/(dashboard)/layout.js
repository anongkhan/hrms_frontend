"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import NotificationModal from "@/components/NotificationModal";
import { canAccessPath, getDefaultRoute, getStoredSession } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getStoredSession();

      if (!session) {
        router.replace("/");
        return;
      }

      if (!canAccessPath(session.user.Role, pathname)) {
        router.replace(getDefaultRoute(session.user.Role));
        return;
      }

      setIsReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-bold text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <NotificationModal />
      <Sidebar />
      <div className="ml-56 h-screen min-w-0 flex-1 overflow-y-auto">
        <Navbar />
        <main className="p-10 pt-28">
          {children}
        </main>
      </div>
    </div>
  );
}
