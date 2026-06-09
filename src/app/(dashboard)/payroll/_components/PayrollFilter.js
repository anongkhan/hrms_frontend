"use client";
import { Search, Calendar } from "lucide-react";

export default function PayrollFilter({ searchTerm, setSearchTerm, selectedMonth, setSelectedMonth }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search Input */}
      <div className="w-full md:flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <input 
          type="text" 
          placeholder="ຄົ້ນຫາດ້ວຍຊື່ພະນັກງານ..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 text-slate-700 transition-all placeholder:text-slate-300"
        />
      </div>

      {/* Month Selector */}
      <div className="w-full md:w-auto flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl">
        <Calendar size={18} className="text-slate-400" />
        <select 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
        >
          <option value="May 2026">May 2026</option>
          <option value="April 2026">April 2026</option>
          <option value="March 2026">March 2026</option>
        </select>
      </div>
    </div>
  );
}