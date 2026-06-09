"use client";
import { Search, Calendar } from "lucide-react";

export default function AttendanceHistory({ history }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pt-4">
        <h3 className="font-bold text-slate-800 text-lg">Attendance History (ປະຫວັດການມາວຽກ)</h3>
      </div>

      <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-5 px-6">Date</th>
                <th className="py-5 px-6">Check In Time</th>
                <th className="py-5 px-6">Check Out Time</th>
                <th className="py-5 px-6">Status</th>
                {/* <th className="py-5 px-6">Note</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
              {history.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-800 flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" /> {row.date}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-700">{row.checkIn || "--:--:--"}</td>
                  <td className="py-4 px-6 font-mono text-slate-700">{row.checkOut || "--:--:--"}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      row.status === "On Time" ? "bg-emerald-50 text-emerald-600" :
                      row.status === "Late" ? "bg-amber-50 text-amber-600" :
                      "bg-rose-50 text-rose-600"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  {/* <td className="py-4 px-6 text-xs text-slate-400">{row.note}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}