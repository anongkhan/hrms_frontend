"use client";
import { Search, Calendar } from "lucide-react";

const MONTHS = [
  { value: "01", label: "ມັງກອນ" },
  { value: "02", label: "ກຸມພາ" },
  { value: "03", label: "ມີນາ" },
  { value: "04", label: "ເມສາ" },
  { value: "05", label: "ພຶດສະພາ" },
  { value: "06", label: "ມິຖຸນາ" },
  { value: "07", label: "ກໍລະກົດ" },
  { value: "08", label: "ສິງຫາ" },
  { value: "09", label: "ກັນຍາ" },
  { value: "10", label: "ຕຸລາ" },
  { value: "11", label: "ພະຈິກ" },
  { value: "12", label: "ທັນວາ" },
];

export default function PayrollFilter({ searchTerm, setSearchTerm, selectedMonth, setSelectedMonth }) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const [selectedYear, selectedMonthNumber] = selectedMonth.split("-");
  const years = Array.from({ length: 6 }, (_, index) => String(currentYear - index));

  const updatePeriod = (year, month) => {
    setSelectedMonth(`${year}-${month}`);
  };

  const updateYear = (year) => {
    const month = Number(year) === currentYear && Number(selectedMonthNumber) > currentMonth
      ? String(currentMonth).padStart(2, "0")
      : selectedMonthNumber;

    updatePeriod(year, month);
  };

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

      {/* Month and Year Selectors */}
      <div className="flex w-full items-center gap-2 md:w-auto">
        <Calendar size={18} className="text-slate-400" />
        <select
          aria-label="ເລືອກເດືອນ"
          value={selectedMonthNumber}
          onChange={(e) => updatePeriod(selectedYear, e.target.value)}
          className="min-w-36 cursor-pointer rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600/20"
        >
          {MONTHS.map((month) => (
            <option
              key={month.value}
              value={month.value}
              disabled={
                Number(selectedYear) === currentYear &&
                Number(month.value) > currentMonth
              }
            >
              {month.label}
            </option>
          ))}
        </select>
        <select
          aria-label="ເລືອກປີ"
          value={selectedYear}
          onChange={(e) => updateYear(e.target.value)}
          className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600/20"
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
