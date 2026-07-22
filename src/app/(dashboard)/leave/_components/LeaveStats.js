"use client";
import { Activity, ShieldAlert, Palmtree } from "lucide-react";

export default function LeaveStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* ລາປ່ວຍ */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
          <Activity size={22} />
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800">{stats.sick.used}/{stats.sick.total} ວັນ</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">ລາປ່ວຍ</p>
        </div>
      </div>

      {/* ລາກິດ */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
          <ShieldAlert size={22} />
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800">{stats.personal.used}/{stats.personal.total} ວັນ</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">ລາກິດ</p>
        </div>
      </div>

      {/* ລາພັກຮ້ອນ */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <Palmtree size={22} />
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800">{stats.vacation.used}/{stats.vacation.total} ວັນ</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">ລາພັກຮ້ອນ</p>
        </div>
      </div>
    </div>
  );
}