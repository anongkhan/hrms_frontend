"use client";
import { useState } from "react";
import { Calendar, Send } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("lo-LA-u-nu-laoo", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
});

function formatLaoDate(value) {
  if (!value) return "";

  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

function DateField({ label, value, onChange }) {
  const displayValue = formatLaoDate(value);

  return (
    <div>
      <label className="text-xs font-bold text-slate-400 uppercase block mb-2">{label}</label>
      <div className="relative">
        <div className="w-full p-3.5 pr-11 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 transition-all">
          <span className={displayValue ? "text-slate-700" : "text-slate-400"}>
            {displayValue || "ວວ/ດດ/ປປປປ"}
          </span>
        </div>
        <Calendar
          size={18}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none"
        />
        <input
          type="date"
          required
          value={value}
          onChange={onChange}
          aria-label={label}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
}

export default function LeaveForm({ onSubmitLeave }) {
  const [formData, setFormData] = useState({
    type: "Sick Leave",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitLeave(formData);
    // ເຄຼຍຟອມຫຼັງກົດສົ່ງ
    setFormData({ type: "Sick Leave", startDate: "", endDate: "", reason: "" });
  };

  return (
    <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-800 text-lg mb-6">Request Leave (ຟອມຍື່ນຂໍລາພັກ)</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* ປະເພດການລາ */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Leave Type</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm text-slate-700 transition-all"
            >
              <option value="Sick Leave">ລາປ່ວຍ (Sick Leave)</option>
              <option value="Personal Leave">ລາກິດ (Personal Leave)</option>
              <option value="Vacation Leave">ລາພັກຮ້ອນ (Vacation Leave)</option>
            </select>
          </div>

          {/* ວັນທີເລີ່ມຕົ້ນ */}
          <DateField
            label="Start Date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
          />

          {/* ວັນທີສິ້ນສຸດ */}
          <DateField
            label="End Date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
          />
        </div>

        {/* ເຫດຜົນການລາ */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Reason for Leave</label>
          <textarea 
            rows="3"
            required
            placeholder="ລະບຸເຫດຜົນການລາພັກ..."
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm text-slate-700 transition-all placeholder:text-slate-300"
          ></textarea>
        </div>

        {/* ປຸ່ມສົ່ງ */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-100"
          >
            <Send size={16} /> ສົ່ງຄຳຮ້ອງຂໍລາ
          </button>
        </div>
      </form>
    </div>
  );
}
