"use client";
import { Users, TrendingUp, CalendarDays } from "lucide-react";

export default function ReportCards({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* ຈຳນວນພະນັກງານທັງໝົດ */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <Users size={22} />
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800">{data.totalEmployees} ຄົນ</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Active Employees (ພະນັກງານທັງໝົດ)</p>
        </div>
      </div>

      {/* ຍອດລາຍຈ່າຍສະສົມ */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
          <TrendingUp size={22} />
        </div>
        <div>
          <p className="text-2xl font-black font-mono text-slate-800">{data.totalYearlyExpense.toLocaleString()} LAK</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Year-to-Date Payroll (ລາຍຈ່າຍສະສົມປີນີ້)</p>
        </div>
      </div>

      {/* ສະຖິຕິການລາພັກເດືອນນີ້ */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
          <CalendarDays size={22} />
        </div>
        <div>
          <p className="text-2xl font-black text-slate-800">{data.totalLeaveRequests} ຄັ້ງ</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Monthly Total Leaves (ການລາພັກເດືອນນີ້)</p>
        </div>
      </div>
    </div>
  );
}