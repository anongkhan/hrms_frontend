"use client";
import { useEffect, useState } from "react";
import DashboardStats from "./_components/DashboardStats";
import OverviewTable from "./_components/OverviewTable";
import { apiRequest } from "@/lib/api";

function mapEmployee(row) {
  return {
    empId: row.Emp_ID,
    name: row.Full_name,
    email: row.Email,
    department: row.Dep_Name || "Unassigned",
    position: row.Pos_name || row.Role,
    status: "Active",
  };
}

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalPresent: 0,
    totalOnLeave: 0,
    employees: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await apiRequest("/api/dashboard/summary");
        setSummary({
          totalEmployees: data.totalEmployees || 0,
          totalPresent: data.totalPresent || 0,
          totalOnLeave: data.totalOnLeave || 0,
          employees: (data.employees || []).map(mapEmployee),
        });
      } catch (err) {
        setError(err.message);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
          {error}
        </div>
      )}

      <DashboardStats
        totalEmp={summary.totalEmployees}
        totalPresent={summary.totalPresent}
        totalOnLeave={summary.totalOnLeave}
      />
      <OverviewTable employees={summary.employees} />
    </div>
  );
}
