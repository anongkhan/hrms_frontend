"use client";
import { ArrowLeft, Save } from "lucide-react";

export default function EmployeeForm({ formData, setFormData, onCancel, onSave }) {
  return (
    <div className="space-y-6">
      {/* Header Form */}
      <div className="flex items-center gap-4">
        <button 
          type="button"
          onClick={onCancel}
          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl shadow-sm transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add New Employee</h1>
          <p className="text-sm text-slate-400 mt-0.5">ກະລຸນາປ້ອນຂໍ້ມູນພະນັກງານໃໝ່ໃຫ້ຄົບຖ້ວນ</p>
        </div>
      </div>

      {/* Form Card Layout */}
      <form onSubmit={onSave} className="bg-white rounded-4xl border border-slate-100 shadow-sm p-8 space-y-8">
        
        {/* Section 1: Personal Info */}
        <div>
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-full"></span> 1. Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Employee ID</label>
              <input type="text" value={formData.empId} disabled
                className="w-full p-3.5 bg-slate-50 border border-slate-100 text-slate-400 font-bold rounded-xl outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Full Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm transition-all"
                placeholder="Enter full name" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Gender</label>
              <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm transition-all text-slate-600">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Telephone</label>
              <input type="text" value={formData.tel} onChange={(e) => setFormData({...formData, tel: e.target.value})}
                className="w-full p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm transition-all"
                placeholder="Enter phone number" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Email Address</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm transition-all"
                placeholder="name@company.com" required />
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Section 2: Job & Salary Info */}
        <div>
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-full"></span> 2. Job & Position
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Department</label>
              <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm transition-all text-slate-600">
                <option value="Human Resource">Human Resource</option>
                <option value="Accounting">Accounting</option>
                <option value="IT Support">IT Support</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Position</label>
              <input type="text" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm transition-all"
                placeholder="e.g. HR Manager" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Basic Salary (LAK)</label>
              <input type="number" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})}
                className="w-full p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm transition-all"
                placeholder="e.g. 5000000" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Bank Account Number</label>
              <input type="text" value={formData.bankAccountNumber} onChange={(e) => setFormData({...formData, bankAccountNumber: e.target.value})}
                className="w-full p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm transition-all"
                placeholder="Enter account number" inputMode="numeric" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">System Role Account</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm transition-all text-slate-600">
                <option value="Employee">Employee</option>
                <option value="HR">HR</option>
                <option value="Accountant">Accountant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-100"
          >
            <Save size={16} /> Save Employee
          </button>
        </div>

      </form>
    </div>
  );
}
