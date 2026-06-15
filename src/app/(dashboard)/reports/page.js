"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Download, FileSpreadsheet, Search, Users, Wallet } from "lucide-react";
import { apiRequest } from "@/lib/api";

const reportTypes = [
  { value: "payroll", label: "Monthly & Yearly Expense Report" },
  { value: "attendance", label: "Employee Attendance, Leave & Absence" },
];

const periods = [
  { value: "month", label: "Monthly" },
  { value: "year", label: "Yearly" },
];

const monthOptions = [
  { value: "2026-06", label: "June 2026" },
  { value: "2026-05", label: "May 2026" },
  { value: "2026-04", label: "April 2026" },
  { value: "2026-03", label: "March 2026" },
  { value: "2026-02", label: "February 2026" },
  { value: "2026-01", label: "January 2026" },
  { value: "2025-12", label: "December 2025" },
];

const yearOptions = ["2026", "2025"];

const formatCurrency = (value) => `${Number(value || 0).toLocaleString()} LAK`;
const getPayrollTotal = (row) => Number(row.total ?? row.salary + row.allowance - row.deduction);
const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

function getMonthLabel(period) {
  const option = monthOptions.find((month) => month.value === period);
  return option?.label?.split(" ")[0] || period;
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState("payroll");
  const [periodType, setPeriodType] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState("2026-06");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        const query = periodType === "month"
          ? `periodType=month&period=${selectedMonth}`
          : `periodType=year&year=${selectedYear}`;
        const data = await apiRequest(`/api/reports/${reportType}?${query}`);
        setRows(data || []);
        setError("");
      } catch (err) {
        setRows([]);
        setError(err.message);
      }
    }

    loadReport();
  }, [periodType, reportType, selectedMonth, selectedYear]);

  const activeRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return rows;

    return rows.filter((row) => (
      Object.values(row).join(" ").toLowerCase().includes(normalizedSearch)
    ));
  }, [rows, searchTerm]);

  const summary = useMemo(() => {
    if (reportType === "payroll") {
      return {
        primaryLabel: "Total Expense",
        primaryValue: formatCurrency(activeRows.reduce((sum, row) => sum + getPayrollTotal(row), 0)),
        secondaryLabel: "Departments",
        secondaryValue: activeRows.length,
      };
    }

    return {
      primaryLabel: "Present Days",
      primaryValue: activeRows.reduce((sum, row) => sum + Number(row.presentDays || 0), 0),
      secondaryLabel: "Leave / Absent",
      secondaryValue: `${activeRows.reduce((sum, row) => sum + Number(row.leaveDays || 0), 0)} / ${activeRows.reduce((sum, row) => sum + Number(row.absentDays || 0), 0)}`,
    };
  }, [activeRows, reportType]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(searchInput);
  };

  const handleExport = () => {
    const columns = reportType === "payroll"
      ? ["ID", "Period", "Department", "Employees", "Salary", "Allowance", "Deduction", "Total"]
      : ["ID", "Employee ID", "Name", "Department", "Period", "Present Days", "Leave Days", "Absent Days", "Late Days"];

    const exportRows = activeRows.map((row) => (
      reportType === "payroll"
        ? [row.id, periodType === "month" ? row.period : row.year, row.department, row.employees, row.salary, row.allowance, row.deduction, getPayrollTotal(row)]
        : [row.id, row.empId, row.name, row.department, row.period, row.presentDays, row.leaveDays, row.absentDays, row.lateDays]
    ));

    const csv = [columns, ...exportRows].map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportType}-${periodType}-report.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
          <p className="mt-1 text-sm text-slate-400">HRMS report table</p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 sm:w-auto"
        >
          <Download size={17} /> Export File
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
            {reportType === "payroll" ? <Wallet size={20} /> : <Users size={20} />}
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
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.4fr_0.8fr_0.8fr_1.4fr]">
          <select
            value={reportType}
            onChange={(event) => setReportType(event.target.value)}
            className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600/20"
          >
            {reportTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            value={periodType}
            onChange={(event) => setPeriodType(event.target.value)}
            className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600/20"
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>

          {periodType === "month" ? (
            <select
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600/20"
            >
              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          ) : (
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600/20"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={17} />
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-blue-600/20"
                placeholder="Search report..."
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700"
            >
              <Search size={16} /> Search
            </button>
          </form>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          {reportType === "payroll" ? (
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
                    <td className="px-6 py-4">{periodType === "month" ? getMonthLabel(row.period) : row.year}</td>
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
                    <td colSpan="8" className="px-6 py-10 text-center font-medium text-slate-300">No report data found</td>
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
                    <td className="px-6 py-4">{periodType === "month" ? row.period : row.year}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{row.presentDays}</td>
                    <td className="px-6 py-4 font-bold text-amber-600">{row.leaveDays}</td>
                    <td className="px-6 py-4 font-bold text-rose-600">{row.absentDays}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-700">{row.lateDays}</td>
                  </tr>
                ))}
                {activeRows.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center font-medium text-slate-300">No report data found</td>
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
