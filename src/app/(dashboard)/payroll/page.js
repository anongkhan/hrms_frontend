"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import PayrollFilter from "./_components/PayrollFilter";
import PayrollTable from "./_components/PayrollTable";
import { apiRequest } from "@/lib/api";
import { notifySuccess, notifyError } from "@/lib/alert";

function parseMonth(value) {
  const parsed = new Date(`${value} 1`);
  if (Number.isNaN(parsed.getTime())) {
    const now = new Date();
    return {
      month: String(now.getMonth() + 1),
      year: String(now.getFullYear()),
    };
  }

  return {
    month: String(parsed.getMonth() + 1),
    year: String(parsed.getFullYear()),
  };
}

function mapPayroll(row) {
  const baseSalary = Number(row.Base_salary || 0);
  const allowance = Number(row.Total_ot || 0);
  const deduction = Number(row.Tax_amount || 0) + Number(row.Social_sec || 0);

  return {
    payrollId: row.Pay_id,
    empId: row.Emp_ID || row.Emp_id,
    name: row.Full_name || row.Emp_id,
    position: row.Pos_name || row.Dep_Name || "-",
    basicSalary: baseSalary,
    allowance,
    deduction,
    netSalary: Number(row.Net_salary || baseSalary + allowance - deduction),
    status: row.Status || "Pending",
  };
}

export default function PayrollPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("May 2026");
  const [payrollData, setPayrollData] = useState([]);
  const [error, setError] = useState("");

  const loadPayroll = useCallback(async () => {
    try {
      const { month, year } = parseMonth(selectedMonth);
      const rows = await apiRequest(`/api/payroll?month=${month}&year=${year}`);
      setPayrollData((rows || []).map(mapPayroll));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, [selectedMonth]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPayroll();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadPayroll]);

  const handlePaySalary = async (id) => {
    try {
      await apiRequest(`/api/payroll/${id}/pay`, { method: "PATCH" });
      notifySuccess("Salary paid successfully");
      await loadPayroll();
    } catch (err) {
      notifyError(err.message);
      setError(err.message);
    }
  };

  const filteredData = useMemo(() => (
    payrollData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.empId.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ), [payrollData, searchTerm]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Payroll Calculation</h1>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
          {error}
        </div>
      )}

      <PayrollFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      <PayrollTable
        payrollData={filteredData}
        onPaySalary={handlePaySalary}
      />
    </div>
  );
}
