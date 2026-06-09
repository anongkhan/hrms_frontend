"use client";
import { Check, CreditCard, Receipt } from "lucide-react";

export default function PayrollTable({ payrollData, onPaySalary }) {
  return (
    <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-5 px-6">Employee</th>
              <th className="py-5 px-6">Basic Salary</th>
              <th className="py-5 px-6">Allowances / OT</th>
              <th className="py-5 px-6">Deductions</th>
              <th className="py-5 px-6">Net Salary</th>
              <th className="py-5 px-6">Status</th>
              <th className="py-5 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm text-slate-600 font-medium">
            {payrollData.map((row) => {
              const netSalary = row.basicSalary + row.allowance - row.deduction;
              return (
                <tr key={row.empId} className="hover:bg-slate-50/40 transition-colors">
                  {/* ຊື່ ແລະ ຕຳແໜ່ງ */}
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800">{row.name}</div>
                    <div className="text-xs text-slate-400 font-normal mt-0.5">{row.empId} • {row.position}</div>
                  </td>
                  {/* ເງິນເດືອນຫຼັກ */}
                  <td className="py-4 px-6 font-mono text-slate-600">{row.basicSalary.toLocaleString()}</td>
                  {/* ເງິນເພີ່ມ */}
                  <td className="py-4 px-6 font-mono text-emerald-600">+{row.allowance.toLocaleString()}</td>
                  {/* ໂດນຫັກ */}
                  <td className="py-4 px-6 font-mono text-rose-600">-{row.deduction.toLocaleString()}</td>
                  {/* ເງິນສຸດທິ */}
                  <td className="py-4 px-6 font-mono font-black text-slate-900">{netSalary.toLocaleString()} LAK</td>
                  {/* ສະຖານະ */}
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      row.status === "Paid" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  {/* ປຸ່ມກົດຈ່າຍ */}
                  <td className="py-4 px-6 text-right">
                    {row.status === "Paid" ? (
                      <button className="p-2 text-emerald-600 bg-emerald-50 rounded-xl cursor-default" title="Paid Complete">
                        <Check size={16} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => onPaySalary(row.empId)}
                        className="flex items-center gap-1.5 ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-100"
                      >
                        <CreditCard size={14} /> Pay
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}