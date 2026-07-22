"use client";
import { useState } from "react";
import { Calendar, Check, CheckCircle, X } from "lucide-react";

export default function LeaveHistory({
  history,
  isHr = false,
  canCancelLeave = false,
  onApproveLeave,
  onCancelLeave,
}) {
  const [submittingId, setSubmittingId] = useState(null);
  const showActionColumn = isHr || canCancelLeave;

  const submitCancel = async (leaveId) => {
    try {
      setSubmittingId(leaveId);
      await onCancelLeave(leaveId);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800 text-lg pt-2">Leave History (ປະຫວັດການລາພັກ)</h3>

      <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-5 px-6">Leave Type</th>
                <th className="py-5 px-6">Duration</th>
                <th className="py-5 px-6">Reason</th>
                <th className="py-5 px-6">Status</th>
                {showActionColumn && <th className="py-5 px-6 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
              {history.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    <div>{row.type}</div>
                    {row.employeeName && (
                      <div className="mt-0.5 text-xs font-medium text-slate-400">
                        {row.employeeName}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar size={14} className="text-slate-400" />
                      {row.startDate} ຫາ {row.endDate}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400 max-w-xs">
                    <div className="truncate">{row.reason}</div>
                    {row.cancelReason && (
                      <div className="mt-1 truncate text-xs font-medium text-rose-400">
                        Cancel reason: {row.cancelReason}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      row.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                      row.status === "Rejected" ? "bg-rose-50 text-rose-600" :
                      row.status === "Cancelled" ? "bg-slate-100 text-slate-500" :
                      "bg-amber-50 text-amber-600 animate-pulse"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  {showActionColumn && (
                    <td className="py-4 px-6 text-right">
                      {isHr && row.status === "Pending" ? (
                        <button
                          type="button"
                          onClick={() => onApproveLeave(row.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-100"
                        >
                          <Check size={14} /> Approve
                        </button>
                      ) : canCancelLeave && row.status === "Pending" ? (
                        <button
                          type="button"
                          disabled={submittingId === row.id}
                          onClick={() => submitCancel(row.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-rose-100 disabled:cursor-not-allowed disabled:bg-rose-300"
                        >
                          <X size={14} /> {submittingId === row.id ? "Cancelling..." : "Cancel"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`p-2 rounded-xl cursor-default ${
                            row.status === "Cancelled"
                              ? "bg-slate-100 text-slate-500"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                          title={row.status}
                          aria-label={row.status}
                          disabled
                        >
                          {row.status === "Cancelled" ? <X size={16} /> : <CheckCircle size={16} />}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
