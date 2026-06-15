"use client";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

export default function EmployeeForm({ mode = "create", formData, setFormData, onCancel, onSave }) {
  const isEdit = mode === "edit";
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ກວດສອບຄວາມຖືກຕ້ອງຂອງຟອມ
  const validate = () => {
    const e = {};

    if (!formData.name?.trim()) e.name = "ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ";

    if (!formData.tel?.trim()) e.tel = "ກະລຸນາປ້ອນເບີໂທ";
    else if (!/^\d{6,10}$/.test(formData.tel.trim())) e.tel = "ເບີໂທຕ້ອງເປັນຕົວເລກ 6-10 ຫຼັກ";

    if (!formData.email?.trim()) e.email = "ກະລຸນາປ້ອນອີເມວ";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = "ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ";

    if (!isEdit && !formData.password) e.password = "ກະລຸນາຕັ້ງລະຫັດຜ່ານ";
    else if (formData.password && formData.password.length < 6) e.password = "ລະຫັດຜ່ານຢ່າງໜ້ອຍ 6 ຕົວ";

    if (!formData.position?.trim()) e.position = "ກະລຸນາປ້ອນຕຳແໜ່ງ";

    if (!String(formData.salary).trim()) e.salary = "ກະລຸນາປ້ອນເງິນເດືອນ";
    else if (Number(formData.salary) <= 0) e.salary = "ເງິນເດືອນຕ້ອງຫຼາຍກວ່າ 0";

    if (!formData.bankAccountNumber?.trim()) e.bankAccountNumber = "ກະລຸນາປ້ອນເລກບັນຊີ";
    else if (!/^\d+$/.test(formData.bankAccountNumber.trim())) e.bankAccountNumber = "ເລກບັນຊີຕ້ອງເປັນຕົວເລກ";

    return e;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave(event);
  };

  // className ຂອງ input + ປ່ຽນເປັນຂອບແດງເມື່ອມີ error
  const inputCls = (field) =>
    `w-full p-3.5 bg-slate-50/80 border rounded-xl focus:ring-2 outline-none text-sm transition-all ${
      errors[field]
        ? "border-rose-300 focus:ring-rose-500/20"
        : "border-slate-100 focus:ring-blue-600/20"
    }`;

  const renderError = (field) =>
    errors[field] ? (
      <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors[field]}</p>
    ) : null;

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
          <h1 className="text-2xl font-bold text-slate-800">{isEdit ? "Edit Employee" : "Add New Employee"}</h1>
          <p className="text-sm text-slate-400 mt-0.5">ກະລຸນາປ້ອນຂໍ້ມູນພະນັກງານໃໝ່ໃຫ້ຄົບຖ້ວນ</p>
        </div>
      </div>

      {/* Form Card Layout — autoComplete=off ກັນ browser ເຕີມຂໍ້ມູນ login ເກົ່າ */}
      <form onSubmit={handleSubmit} noValidate autoComplete="off" className="bg-white rounded-4xl border border-slate-100 shadow-sm p-8 space-y-8">

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
              <input type="text" value={formData.name} onChange={(e) => update("name", e.target.value)}
                className={inputCls("name")} placeholder="Enter full name" />
              {renderError("name")}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Gender</label>
              <select value={formData.gender} onChange={(e) => update("gender", e.target.value)}
                className="w-full p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm transition-all text-slate-600">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Telephone</label>
              <input type="text" value={formData.tel} onChange={(e) => update("tel", e.target.value)}
                className={inputCls("tel")} placeholder="Enter phone number" inputMode="numeric" />
              {renderError("tel")}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Address</label>
              <input type="text" value={formData.address} onChange={(e) => update("address", e.target.value)}
                className="w-full p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm transition-all"
                placeholder="Enter address" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Email Address</label>
              <input type="email" name="employee_email" value={formData.email} onChange={(e) => update("email", e.target.value)}
                autoComplete="off" className={inputCls("email")} placeholder="name@company.com" />
              {renderError("email")}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Password</label>
              <input
                type="password"
                name="employee_password"
                value={formData.password}
                onChange={(e) => update("password", e.target.value)}
                autoComplete="new-password"
                className={inputCls("password")}
                placeholder={isEdit ? "Leave blank to keep current password" : "Enter password"}
              />
              {renderError("password")}
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
              <select value={formData.department} onChange={(e) => update("department", e.target.value)}
                className="w-full p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm transition-all text-slate-600">
                <option value="Human Resource">Human Resource</option>
                <option value="Accounting">Accounting</option>
                <option value="IT">IT</option>
                <option value="IT Support">IT Support</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Position</label>
              <input type="text" value={formData.position} onChange={(e) => update("position", e.target.value)}
                className={inputCls("position")} placeholder="e.g. HR Manager" />
              {renderError("position")}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Basic Salary (LAK)</label>
              <input type="number" value={formData.salary} onChange={(e) => update("salary", e.target.value)}
                className={inputCls("salary")} placeholder="e.g. 5000000" />
              {renderError("salary")}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Bank Account Number</label>
              <input type="text" value={formData.bankAccountNumber} onChange={(e) => update("bankAccountNumber", e.target.value)}
                className={inputCls("bankAccountNumber")} placeholder="Enter account number" inputMode="numeric" />
              {renderError("bankAccountNumber")}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">System Role Account</label>
              <select value={formData.role} onChange={(e) => update("role", e.target.value)}
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
            <Save size={16} /> {isEdit ? "Update Employee" : "Save Employee"}
          </button>
        </div>

      </form>
    </div>
  );
}
