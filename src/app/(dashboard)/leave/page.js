"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import LeaveStats from "./_components/LeaveStats";
import LeaveForm from "./_components/LeaveForm";
import LeaveHistory from "./_components/LeaveHistory";
import { apiRequest } from "@/lib/api";
import { getStoredSession } from "@/lib/auth";
import { notifySuccess, notifyError } from "@/lib/alert";

const fallbackStats = {
  sick: { used: 0, total: 6 },
  personal: { used: 0, total: 5 },
  vacation: { used: 0, total: 12 },
};

function mapLeave(row) {
  return {
    id: row.Leave_id,
    employeeName: row.Full_name,
    type: row.Leave_type,
    startDate: row.Start_date?.slice?.(0, 10) || row.Start_date,
    endDate: row.End_date?.slice?.(0, 10) || row.End_date,
    reason: row.Reason,
    status: row.Status,
  };
}

export default function LeavePage() {
  const [leaveStats, setLeaveStats] = useState(fallbackStats);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const session = getStoredSession();
  const role = session?.user?.Role;
  const canApproveLeave = role === "HR" || role === "Admin";

  const loadLeaveData = useCallback(async () => {
    try {
      const [stats, leaves] = await Promise.all([
        apiRequest("/api/leave/stats"),
        apiRequest("/api/leave"),
      ]);
      setLeaveStats(stats || fallbackStats);
      setHistory((leaves || []).map(mapLeave));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLeaveData();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadLeaveData]);

  const handleLeaveSubmit = async (newLeave) => {
    try {
      await apiRequest("/api/leave/request", {
        method: "POST",
        body: JSON.stringify({
          Leave_type: newLeave.type,
          Start_date: newLeave.startDate,
          End_date: newLeave.endDate,
          Reason: newLeave.reason,
        }),
      });
      notifySuccess("Leave request submitted");
      await loadLeaveData();
    } catch (err) {
      notifyError(err.message);
      setError(err.message);
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      await apiRequest("/api/leave/update-status", {
        method: "PUT",
        body: JSON.stringify({ Leave_id: leaveId, Status: "Approved" }),
      });
      notifySuccess("Leave approved");
      await loadLeaveData();
    } catch (err) {
      notifyError(err.message);
      setError(err.message);
    }
  };

  const title = useMemo(() => (
    canApproveLeave ? "Leave Requests" : "My Leave"
  ), [canApproveLeave]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
          {error}
        </div>
      )}

      {/* HR/Admin = ຜູ້ອະນຸມັດ → ເຫັນແຕ່ Leave History; Employee → ເຫັນສະຖິຕິ + ຟອມຍື່ນຂໍລາ */}
      {!canApproveLeave && (
        <>
          <LeaveStats stats={leaveStats} />
          <LeaveForm onSubmitLeave={handleLeaveSubmit} />
        </>
      )}
      <LeaveHistory
        history={history}
        isHr={canApproveLeave}
        onApproveLeave={handleApproveLeave}
      />
    </div>
  );
}
