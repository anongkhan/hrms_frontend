"use client";

import { useEffect, useState } from "react";
import { CalendarDays, UserCircle2 } from "lucide-react";
import { getStoredSession } from "@/lib/auth";

function formatDateTime(date) {
  if (!date) {
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = String(hours % 12 || 12).padStart(2, "0");

  return `${day}/${month}/${year} - ${displayHours}:${minutes} ${period}`;
}

export default function Navbar() {
  const [now, setNow] = useState(() => new Date());
  const [session, setSession] = useState(null);

  useEffect(() => {
    const sessionTimer = setTimeout(() => {
      setSession(getStoredSession());
    }, 0);
    const timer = setInterval(() => setNow(new Date()), 30000);

    return () => {
      clearTimeout(sessionTimer);
      clearInterval(timer);
    };
  }, []);

  const user = session?.user;
  const displayName = user?.Full_name || user?.name || user?.Email || "User";
  const displayRole = user?.Role || user?.role || "";

  return (
    <header className="fixed top-0 right-0 left-56 z-20 h-20 border-b border-dash-border bg-white/90 px-10 backdrop-blur">
      <div className="flex h-full items-center justify-end gap-5">
        <div className="flex h-12 min-w-64 items-center justify-center gap-3 rounded-full border border-dash-border bg-dash-pill px-6 text-sm font-bold text-slate-700 shadow-sm">
          <CalendarDays size={17} className="text-emerald-500" />
          <span className="tabular-nums" suppressHydrationWarning>
            {formatDateTime(now)}
          </span>
        </div>

        <div className="flex h-12 min-w-44 items-center gap-3 rounded-full border border-dash-border bg-dash-pill px-4 shadow-sm">
          <UserCircle2 size={36} className="text-dash-primary" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-5 text-slate-800">{displayName}</p>
            <p className="text-xs font-medium leading-4 text-dash-muted">{displayRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
