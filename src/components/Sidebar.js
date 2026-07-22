"use client";

import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Clock,
  CreditCard,
  Wallet,
  FileText,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, getStoredSession, ROLE_ROUTES } from "@/lib/auth";

const menu = [
  { name: "ໜ້າຫຼັກ", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
  { name: "ພະນັກງານ", icon: <Users size={20} />, path: "/teams" },
  { name: "ການມາວຽກ", icon: <Clock size={20} />, path: "/attendance" },
  { name: "ການລາພັກ", icon: <CreditCard size={20} />, path: "/leave" },
  { name: "ເງິນເດືອນ", icon: <Wallet size={20} />, path: "/payroll" },
  { name: "ລາຍງານ", icon: <FileText size={20} />, path: "/reports" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const session = getStoredSession();
  const role = session?.user?.Role;
  const allowedRoutes = ROLE_ROUTES[role] || [];
  const visibleMenu = menu.filter((item) => allowedRoutes.includes(item.path));

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  return (
    <div className="w-56 h-screen bg-dash-sidebar border-r border-white/10 flex flex-col p-5 fixed left-0 top-0 z-30 font-bold shadow-[4px_0_24px_rgba(15,23,42,0.25)]">
      <div className="flex h-20 items-center justify-center mb-2">
        <Image
          src="/images/logo.png"
          alt="HRMS"
          width={88}
          height={88}
          className="h-20 w-20 object-contain"
          priority
        />
      </div>
      <hr className="-mx-5 mb-4 w-[calc(100%+2.5rem)] border-0 border-t-2 border-slate-500/35" />
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {visibleMenu.map((item) => (
          <MenuItem
            key={item.name}
            item={item}
            active={pathname === item.path}
            onClick={() => router.push(item.path)}
          />
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 px-3.5 py-3 text-rose-400 hover:bg-white/10 hover:text-rose-300 rounded-xl transition-all font-bold text-sm mt-auto w-full"
      >
        <LogOut size={20} /> ອອກຈາກລະບົບ
      </button>
    </div>
  );
}

function MenuItem({ item, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all ${
        active
          ? "bg-white/10 text-white shadow-sm"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="shrink-0">{item.icon}</span>
      <span className="whitespace-nowrap text-[15px] font-extrabold leading-none">{item.name}</span>
    </div>
  );
}
