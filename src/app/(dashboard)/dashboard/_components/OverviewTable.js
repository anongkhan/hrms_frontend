"use client";
import { useState } from "react";
import { Search, Filter } from "lucide-react";

export default function OverviewTable({ employees }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  // ດຶງລາຍຊື່ພະແນກທີ່ມີຈິງຈາກຂໍ້ມູນພະນັກງານ (ບໍ່ຊ້ຳ + ລຽງ A-Z)
  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))].sort();

  // Filter ຂໍ້ມູນຕາມຄຳຄົ້ນຫາ ແລະ ພະແນກທີ່ເລືອກ
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.empId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "All" || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="w-full sm:flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="ຄົ້ນຫາພະນັກງານ" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 text-slate-700 transition-all placeholder:text-slate-300"
          />
        </div>
        
        {/* Dropdown ກັ່ນຕອງພະແນກ */}
        <div className="w-full sm:w-auto flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">
          <Filter size={16} className="text-slate-400" />
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer"
          >
            <option value="All">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
          <h3 className="font-bold text-slate-800 text-base">ລາຍຊື່ພະນັກງານທັງໝົດ</h3>
          <span className="text-xs bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-full">
            ທັງໝົດ {filteredEmployees.length} ຄົນ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-5 px-6">Employee ID</th>
                <th className="py-5 px-6">Full Name</th>
                <th className="py-5 px-6">Department</th>
                <th className="py-5 px-6">Position</th>
                <th className="py-5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm text-slate-600 font-medium">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.empId} className="hover:bg-slate-50/40 transition-colors">
                    {/* ID */}
                    <td className="py-4 px-6 font-bold text-blue-600 font-mono">{emp.empId}</td>
                    
                    {/* Name */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{emp.name}</div>
                      <div className="text-xs text-slate-400 font-normal mt-0.5">{emp.email}</div>
                    </td>
                    
                    {/* Department */}
                    <td className="py-4 px-6">
                      <span className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg">
                        {emp.department}
                      </span>
                    </td>
                    
                    {/* Position */}
                    <td className="py-4 px-6 text-slate-500 font-semibold">{emp.position}</td>
                    
                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`w-2.5 h-2.5 rounded-full inline-block mr-2 ${
                        emp.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                      }`}></span>
                      <span className="text-xs text-slate-600 font-bold">{emp.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-300 font-medium">
                    ❌ ບໍ່ພົບຂໍ້ມູນພະນັກງານທີ່ຄົ້ນຫາ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}