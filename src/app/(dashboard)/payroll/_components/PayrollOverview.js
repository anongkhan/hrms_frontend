"use client";
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function PayrollOverview({ totalSalary, totalBonus, totalDeduction }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* ຍອດລາຍຈ່າຍທັງໝົດ */}
      <div className="bg-slate-900 text-white p-6 rounded-[28px] shadow-xl shadow-slate-900/10 flex items-center gap-5">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
          <Wallet size={22} />
        </div>
        <div>
          <p className="text-2xl font-black font-mono">{(totalSalary + totalBonus - totalDeduction).toLocaleString()} LAK</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Total Net Payroll (ລາຍຈ່າຍສຸດທິ)</p>
        </div>
      </div>

      {/* ຍອດເງິນເພີ່ມ / OT */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
          <ArrowUpRight size={22} />
        </div>
        <div>
          <p className="text-2xl font-black font-mono text-slate-800">+{totalBonus.toLocaleString()} LAK</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Total Allowances/OT (ລາຍຮັບເພີ່ມທັງໝົດ)</p>
        </div>
      </div>

      {/* ຍອດເງິນໂດນຫັກ */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
          <ArrowDownRight size={22} />
        </div>
        <div>
          <p className="text-2xl font-black font-mono text-slate-800">-{totalDeduction.toLocaleString()} LAK</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Total Deductions (ຍອດໂດນຫັກ ມາຊ້າ/ຂາດ)</p>
        </div>
      </div>
    </div>
  );
}