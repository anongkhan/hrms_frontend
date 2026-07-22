"use client";
import { Users, Clock, CalendarX } from "lucide-react";

export default function DashboardStats({ totalEmp, totalPresent, totalOnLeave }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* ພະນັກງານທັງໝົດ */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <Users size={22} />
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800">{totalEmp} ຄົນ</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">ພະນັກງານທັງໝົດ</p>
        </div>
      </div>

      {/* ເຂົ້າງານແລ້ວມື້ນີ້ */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
          <Clock size={22} />
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800">{totalPresent} ຄົນ</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">ມາວຽກແລ້ວມື້ນີ້</p>
        </div>
      </div>

      {/* ລາພັກມື້ນີ້ */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
          <CalendarX size={22} />
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800">{totalOnLeave} ຄົນ</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">ລາພັກມື້ນີ້</p>
        </div>
      </div>
    </div>
  );
}