"use client";
import { useEffect, useState } from "react";
import DashboardStats from "./_components/DashboardStats";
import OverviewTable from "./_components/OverviewTable";
import { apiRequest } from "@/lib/api";
import { getStoredSession } from "@/lib/auth";

const ADMIN_ONLY_ID_PREFIXES = ["HR-", "ACC-", "ADM-"];

function canViewEmployee(row, role) {
  if (role === "Admin") return true;

  const employeeId = String(row.Emp_ID || "").trim().toUpperCase();
  return !ADMIN_ONLY_ID_PREFIXES.some((prefix) => employeeId.startsWith(prefix));
}

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
        const role = getStoredSession()?.user?.Role;
        const visibleEmployees = (data.employees || []).filter((employee) =>
          canViewEmployee(employee, role)
        );

        setSummary({
          totalEmployees: role === "Admin"
            ? data.totalEmployees || visibleEmployees.length
            : visibleEmployees.length,
          totalPresent: data.totalPresent || 0,
          totalOnLeave: data.totalOnLeave || 0,
          employees: visibleEmployees.map(mapEmployee),
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
