"use client";
import { Calendar, UserRound } from "lucide-react";

function formatOvertime(minutes) {
  if (minutes === null || minutes === undefined) return "--";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;

  return `${hours}h ${remainingMinutes}m`;
}

export default function AttendanceHistory({ history, role }) {
  const canViewEmployee = role === "Admin" || role === "HR";
  const canViewOvertime = role === "Admin" || role === "HR";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pt-4">
        <h3 className="font-bold text-slate-800 text-lg">ປະຫວັດການມາວຽກ</h3>
      </div>

      <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-5 px-6">Date</th>
                {canViewEmployee && <th className="py-5 px-6">Employee</th>}
                <th className="py-5 px-6">Check In Time</th>
                <th className="py-5 px-6">Check Out Time</th>
                {canViewOvertime && <th className="py-5 px-6">OT Hours</th>}
                <th className="py-5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
              {history.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-800 flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" /> {row.date}
                  </td>
                  {canViewEmployee && (
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <UserRound size={16} className="text-slate-400" />
                        <div>
                          <div className="font-semibold text-slate-800">
                            {row.employeeName || row.employeeId || "Unknown employee"}
                          </div>
                          {row.employeeId && row.employeeName && (
                            <div className="mt-0.5 text-xs font-medium text-slate-400">{row.employeeId}</div>
                          )}
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="py-4 px-6 font-mono text-slate-700">{row.checkIn || "--:--:--"}</td>
                  <td className="py-4 px-6 font-mono text-slate-700">{row.checkOut || "--:--:--"}</td>
                  {canViewOvertime && (
                    <td className="py-4 px-6">
                      <span className={`inline-flex min-w-16 justify-center rounded-full px-3 py-1 text-xs font-bold ${
                        row.overtimeMinutes > 0
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {formatOvertime(row.overtimeMinutes)}
                      </span>
                    </td>
                  )}
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      row.status === "On Time" ? "bg-emerald-50 text-emerald-600" :
                      row.status === "Late" ? "bg-amber-50 text-amber-600" :
                      "bg-rose-50 text-rose-600"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
