"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import AttendancePunch from "./_components/AttendancePunch";
import AttendanceHistory from "./_components/AttendanceHistory";
import { apiRequest } from "@/lib/api";
import { getStoredSession } from "@/lib/auth";
import { notifySuccess, notifyError } from "@/lib/alert";

function mapAttendance(row) {
  const checkIn = row.Check_in ? new Date(row.Check_in) : null;
  const checkOut = row.Check_out ? new Date(row.Check_out) : null;
  const employeeId = row.Emp_ID || row.empId || row.employeeId || row.User_ID || row.User_id;
  const employeeName = row.Full_name || row.fullName || row.employeeName || row.Name || row.name;

  return {
    date: row.Work_Date?.slice?.(0, 10) || row.Work_Date,
    employeeId,
    employeeName,
    checkIn: checkIn ? checkIn.toLocaleTimeString("en-US", { hour12: false }) : null,
    checkOut: checkOut ? checkOut.toLocaleTimeString("en-US", { hour12: false }) : null,
    status: checkIn && (checkIn.getHours() > 8 || (checkIn.getHours() === 8 && checkIn.getMinutes() > 0)) ? "Late" : "On Time",
  };
}

export default function AttendancePage() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const session = getStoredSession();
  const role = session?.user?.Role;
  const canPunchAttendance = role !== "HR";

  const loadAttendance = useCallback(async () => {
    try {
      const rows = await apiRequest("/api/attendance");
      setHistory((rows || []).map(mapAttendance));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAttendance();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadAttendance]);

  const todayStatus = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayRecord = history.find((row) => row.date === today);

    return {
      checkIn: todayRecord?.checkIn || null,
      checkOut: todayRecord?.checkOut || null,
    };
  }, [history]);

  const handleCheckIn = async () => {
    try {
      await apiRequest("/api/attendance/check-in", { method: "POST" });
      notifySuccess("Checked in successfully");
      await loadAttendance();
    } catch (err) {
      notifyError(err.message);
      setError(err.message);
    }
  };

  const handleCheckOut = async () => {
    try {
      await apiRequest("/api/attendance/check-out", { method: "POST" });
      notifySuccess("Checked out successfully");
      await loadAttendance();
    } catch (err) {
      notifyError(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Time Attendance</h1>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
          {error}
        </div>
      )}

      {canPunchAttendance && (
        <AttendancePunch
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          todayStatus={todayStatus}
        />
      )}
      <AttendanceHistory history={history} role={role} />
    </div>
  );
}
