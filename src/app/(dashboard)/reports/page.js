"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Download, FileSpreadsheet, Filter, Search, Users, Wallet, X } from "lucide-react";
import { apiRequest } from "@/lib/api";

const reportTypes = [
  { value: "payroll", label: "ສະຫຼຸບຄ່າໃຊ້ຈ່າຍ" },
  { value: "attendance", label: "ການເຂົ້າວຽກ ແລະ ການລາພັກ" },
];

const periods = [
  { value: "month", label: "ລາຍເດືອນ" },
  { value: "year", label: "ລາຍປີ" },
];

const monthOptions = [
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

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
const yearOptions = Array.from({ length: 6 }, (_, index) => String(currentYear - index));
const initialMonth = `${currentYear}-${currentMonth}`;

const formatCurrency = (value) => `${Number(value || 0).toLocaleString()} LAK`;
const getPayrollTotal = (row) => Number(row.total ?? row.salary + row.allowance - row.deduction);
const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

function getMonthLabel(period) {
  const month = String(period || "").split("-")[1];
  return monthOptions.find((option) => option.value === month)?.label || period;
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState("payroll");
  const [periodType, setPeriodType] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [appliedFilters, setAppliedFilters] = useState({
    reportType: "payroll",
    periodType: "month",
    period: initialMonth,
    year: String(currentYear),
  });
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        const query = appliedFilters.periodType === "month"
          ? `periodType=month&period=${appliedFilters.period}`
          : `periodType=year&year=${appliedFilters.year}`;
        const data = await apiRequest(`/api/reports/${appliedFilters.reportType}?${query}`);
        setRows(data || []);
        setError("");
      } catch (err) {
        setRows([]);
        setError(err.message);
      }
    }

    loadReport();
  }, [appliedFilters]);

  const activeReportType = appliedFilters.reportType;
  const activePeriodType = appliedFilters.periodType;
  const selectedMonthNumber = selectedMonth.split("-")[1];

  const handleMonthChange = (month) => {
    setSelectedMonth(`${selectedYear}-${month}`);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);

    const month = Number(year) === currentYear && Number(selectedMonthNumber) > Number(currentMonth)
      ? currentMonth
      : selectedMonthNumber;

    setSelectedMonth(`${year}-${month}`);
  };

  const handleApplyFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setAppliedFilters({
      reportType,
      periodType,
      period: selectedMonth,
      year: selectedYear,
    });
  };

  const activeRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return rows;

    return rows.filter((row) => (
      Object.values(row).join(" ").toLowerCase().includes(normalizedSearch)
    ));
  }, [rows, searchTerm]);

  const summary = useMemo(() => {
    if (activeReportType === "payroll") {
      return {
        primaryLabel: "ລາຍຈ່າຍທັງໝົດ",
        primaryValue: formatCurrency(activeRows.reduce((sum, row) => sum + getPayrollTotal(row), 0)),
        secondaryLabel: "ພະນັກງານ",
        secondaryValue: new Set(activeRows.map((row) => row.employees)).size,
      };
    }

    return {
      primaryLabel: "ປະຈຸບັນ",
      primaryValue: activeRows.reduce((sum, row) => sum + Number(row.presentDays || 0), 0),
      secondaryLabel: "ລາພັກ / ຂາດວຽກ",
      secondaryValue: `${activeRows.reduce((sum, row) => sum + Number(row.leaveDays || 0), 0)} / ${activeRows.reduce((sum, row) => sum + Number(row.absentDays || 0), 0)}`,
    };
  }, [activeReportType, activeRows]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  const handleExport = () => {
    const columns = activeReportType === "payroll"
      ? ["ID", "Period", "Department", "Employees", "Salary", "Allowance", "Deduction", "Total"]
      : ["ID", "Employee ID", "Name", "Department", "Period", "Present Days", "Leave Days", "Absent Days", "Late Days"];

    const exportRows = activeRows.map((row) => (
      activeReportType === "payroll"
        ? [row.id, activePeriodType === "month" ? row.period : row.year, row.department, row.employees, row.salary, row.allowance, row.deduction, getPayrollTotal(row)]
        : [row.id, row.empId, row.name, row.department, row.period, row.presentDays, row.leaveDays, row.absentDays, row.lateDays]
    ));

    const csv = [columns, ...exportRows].map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeReportType}-${activePeriodType}-report.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
          {/* <p className="mt-1 text-sm text-slate-400">HRMS report table</p> */}
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 sm:w-auto"
        >
          <Download size={17} /> Exports
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {activeReportType === "payroll" ? <Wallet size={20} /> : <Users size={20} />}
          </div>
          <p className="text-xs font-bold uppercase text-slate-400">{summary.primaryLabel}</p>
          <p className="mt-1 text-xl font-black text-slate-800">{summary.primaryValue}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <CalendarDays size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-slate-400">{summary.secondaryLabel}</p>
          <p className="mt-1 text-xl font-black text-slate-800">{summary.secondaryValue}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <FileSpreadsheet size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-slate-400">Rows</p>
          <p className="mt-1 text-xl font-black text-slate-800">{activeRows.length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.3fr_0.8fr_1.3fr_auto_1.4fr]">
          <select
            aria-label="ປະເພດລາຍງານ"
            value={reportType}
            onChange={(event) => setReportType(event.target.value)}
            className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600/20"
          >
            {reportTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            aria-label="ຮູບແບບລາຍງານ"
            value={periodType}
            onChange={(event) => setPeriodType(event.target.value)}
            className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600/20"
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>

          {periodType === "month" ? (
            <div className="grid grid-cols-2 gap-2">
              <select
                aria-label="ເລືອກເດືອນ"
                value={selectedMonthNumber}
                onChange={(event) => handleMonthChange(event.target.value)}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600/20"
              >
                {monthOptions.map((month) => (
                  <option
                    key={month.value}
                    value={month.value}
                    disabled={
                      Number(selectedYear) === currentYear &&
                      Number(month.value) > Number(currentMonth)
                    }
                  >
                    {month.label}
                  </option>
                ))}
              </select>
              <select
                aria-label="ເລືອກປີ"
                value={selectedYear}
                onChange={(event) => handleYearChange(event.target.value)}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600/20"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          ) : (
            <select
              aria-label="ເລືອກປີ"
              value={selectedYear}
              onChange={(event) => handleYearChange(event.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600/20"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={handleApplyFilters}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700"
          >
            <Filter size={16} /> ສະແດງລາຍງານ
          </button>

          <form
            onSubmit={handleSearch}
            className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-sm transition-all focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/10"
          >
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="h-full w-full border-0 bg-transparent py-2.5 pl-10 pr-10 text-sm text-slate-700 outline-none placeholder:text-slate-300"
                placeholder="ຄົ້ນຫາລາຍງານ..."
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="ລ້າງຄຳຄົ້ນຫາ"
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="flex min-w-24 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-[0.98]"
            >
              <Search size={16} /> ຄົ້ນຫາ
            </button>
          </form>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          {activeReportType === "payroll" ? (
            <table className="w-full min-w-230 border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Report ID</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Employees</th>
                  <th className="px-6 py-4">Salary</th>
                  <th className="px-6 py-4">Allowance</th>
                  <th className="px-6 py-4">Deduction</th>
                  <th className="px-6 py-4 text-right">Total Expense</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                {activeRows.map((row, index) => (
                  <tr key={`${row.id}-${index}`} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-blue-600">{row.id}</td>
                    <td className="px-6 py-4">{activePeriodType === "month" ? getMonthLabel(row.period) : row.year}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{row.department}</td>
                    <td className="px-6 py-4">{row.employees}</td>
                    <td className="px-6 py-4 font-mono">{formatCurrency(row.salary)}</td>
                    <td className="px-6 py-4 font-mono text-emerald-600">{formatCurrency(row.allowance)}</td>
                    <td className="px-6 py-4 font-mono text-rose-600">{formatCurrency(row.deduction)}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">{formatCurrency(getPayrollTotal(row))}</td>
                  </tr>
                ))}
                {activeRows.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center font-medium text-slate-300">ບໍ່ພົບຂໍ້ມູນລາຍງານ</td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-230 border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Employee ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Present</th>
                  <th className="px-6 py-4">Leave</th>
                  <th className="px-6 py-4">Absent</th>
                  <th className="px-6 py-4 text-right">Late</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                {activeRows.map((row, index) => (
                  <tr key={`${row.id}-${index}`} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-blue-600">{row.empId}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{row.name}</td>
                    <td className="px-6 py-4">{row.department}</td>
                    <td className="px-6 py-4">{activePeriodType === "month" ? row.period : row.year}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{row.presentDays}</td>
                    <td className="px-6 py-4 font-bold text-amber-600">{row.leaveDays}</td>
                    <td className="px-6 py-4 font-bold text-rose-600">{row.absentDays}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-700">{row.lateDays}</td>
                  </tr>
                ))}
                {activeRows.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center font-medium text-slate-300">ບໍ່ພົບຂໍ້ມູນລາຍງານ</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
