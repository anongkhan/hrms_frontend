"use client";
import { useState } from "react";
import { Plus, Search, Edit2, Trash2, MoreVertical } from "lucide-react";

export default function EmployeeList({ employees, onAddNew, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const MENU_WIDTH = 144;
  const MENU_HEIGHT = 96;

  const toggleMenu = (emp, event) => {
    if (openMenuId === emp.empId) {
      setOpenMenuId(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();

    // ໂດຍ default ເປີດລົງລຸ່ມ; ຖ້າພື້ນທີ່ລຸ່ມບໍ່ພໍ → ພິກຂຶ້ນເທິງ (ກັນຖືກຂອບຈໍຕັດ)
    let top = rect.bottom + 6;
    if (top + MENU_HEIGHT > window.innerHeight) {
      top = rect.top - MENU_HEIGHT - 6;
    }

    // ຊິດຂວາຂອງປຸ່ມ; ກັນບໍ່ໃຫ້ລົ້ນຊ້າຍຈໍ
    let left = rect.right - MENU_WIDTH;
    if (left < 8) left = 8;

    setMenuPos({ top, left });
    setOpenMenuId(emp.empId);
  };

  // ຟັງຊັນຄົ້ນຫາຂໍ້ມູນ
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.empId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Employee Management</h1>
          {/* <p className="text-sm text-slate-400 mt-1">ຈັດການຂໍ້ມູນພະນັກງານ, ເພີ່ມ, ລຶບ ແລະ ແກ້ໄຂຂໍ້ມູນ</p> */}
        </div>
        <button 
          onClick={onAddNew}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <input 
          type="text" 
          placeholder="ຄົ້ນຫາພະນັກງານ" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 text-slate-700 transition-all placeholder:text-slate-300"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-5 px-6">Emp ID</th>
                <th className="py-5 px-6">Name</th>
                <th className="py-5 px-6">Contact</th>
                <th className="py-5 px-6">Department & Position</th>
                <th className="py-5 px-6">Bank Account</th>
                <th className="py-5 px-6">System Role</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.empId} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-blue-600">{emp.empId}</td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{emp.name}</div>
                      <div className="text-xs text-slate-300 font-normal mt-0.5">{emp.gender}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div>{emp.tel}</div>
                      <div className="text-xs text-slate-400 font-normal">{emp.email}</div>
                      {/* {emp.address && <div className="text-xs text-slate-300 font-normal mt-0.5">{emp.address}</div>} */}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-700">{emp.department}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{emp.position}</div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">{emp.bankAccountNumber}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        emp.role === "HR" ? "bg-red-50 text-red-600" :
                        emp.role === "Accountant" ? "bg-green-50 text-green-600" :
                        "bg-blue-50 text-blue-600"
                      }`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={(e) => toggleMenu(emp, e)}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                        aria-label="Actions"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-300 font-medium">
                    ❌ ບໍ່ພົບຂໍ້ມູນພະນັກງານ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dropdown menu (fixed -> ບໍ່ໂດນ overflow ຂອງຕາຕະລາງຕັດ) */}
      {openMenuId && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
          <div
            className="fixed z-50 w-36 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl"
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            <button
              type="button"
              onClick={() => {
                const emp = employees.find((e) => e.empId === openMenuId);
                setOpenMenuId(null);
                if (emp) onEdit?.(emp);
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600"
            >
              <Edit2 size={15} /> Edit
            </button>
            <button
              type="button"
              onClick={() => {
                const id = openMenuId;
                setOpenMenuId(null);
                onDelete?.(id);
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
