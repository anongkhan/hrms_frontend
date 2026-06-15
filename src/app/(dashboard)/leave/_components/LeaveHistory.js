"use client";
import { Calendar, Check, CheckCircle } from "lucide-react";

export default function LeaveHistory({ history, isHr = false, onApproveLeave }) {
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
                {isHr && <th className="py-5 px-6 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
              {history.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    <div>{row.type}</div>
                    {row.employeeName && <div className="mt-0.5 text-xs font-medium text-slate-400">{row.employeeName}</div>}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar size={14} className="text-slate-400" />
                      {row.startDate} ຫາ {row.endDate}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400 max-w-xs truncate">{row.reason}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      row.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                      row.status === "Rejected" ? "bg-rose-50 text-rose-600" :
                      "bg-amber-50 text-amber-600 animate-pulse"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  {isHr && (
                    <td className="py-4 px-6 text-right">
                      {row.status === "Pending" ? (
                        <button
                          type="button"
                          onClick={() => onApproveLeave(row.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-100"
                        >
                          <Check size={14} /> Approve
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="p-2 text-emerald-600 bg-emerald-50 rounded-xl cursor-default"
                          title="Leave approved"
                          aria-label="Leave approved"
                          disabled
                        >
                          <CheckCircle size={16} />
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
