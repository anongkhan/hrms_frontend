"use client";
import { useState, useEffect } from "react";
import { LogIn, LogOut, Clock, CheckCircle } from "lucide-react";

export default function AttendancePunch({ onCheckIn, onCheckOut, todayStatus }) {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // ເຮັດໃຫ້ໂມງແລ່ນແບບ Real-time ທຸກໆ 1 ວິນາທີ
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
      setCurrentDate(now.toLocaleDateString("la-LA", { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* 🔴 Card ໂມງເວລາປັດຈຸບັນ */}
      <div className="bg-slate-900 text-white p-8 rounded-4xl flex flex-col justify-center items-center shadow-xl shadow-slate-900/10 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-white/5 pointer-events-none">
          <Clock size={160} />
        </div>
        <p className="text-xs uppercase font-bold text-blue-400 tracking-widest mb-2">{currentDate}</p>
        <h2 className="text-4xl font-black tracking-tight font-mono">{currentTime}</h2>
        <p className="text-xs text-slate-400 mt-2">PTL Capital Server Time</p>
      </div>

      {/* 🟢 Card ປຸ່ມກົດ ເຂົ້າງານ (Check In) */}
      <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Shift Start</span>
          <h3 className="text-lg font-bold text-slate-800">Check In (ເຂົ້າວຽກ)</h3>
          <p className="text-xs text-slate-400 mt-1">ເວລາມາດຕະຖານ: 08:00 AM</p>
        </div>
        
        <div className="mt-6">
          {todayStatus.checkIn ? (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-4 rounded-2xl font-bold text-sm">
              <CheckCircle size={18} /> Checked In at {todayStatus.checkIn}
            </div>
          ) : (
            <button
              onClick={onCheckIn}
              className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-blue-100"
            >
              <LogIn size={18} /> ກົດເຂົ້າເວລາງານ
            </button>
          )}
        </div>
      </div>

      {/* 🔵 Card ປຸ່ມກົດ ອອກງານ (Check Out) */}
      <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Shift End</span>
          <h3 className="text-lg font-bold text-slate-800">Check Out (ອອກວຽກ)</h3>
          <p className="text-xs text-slate-400 mt-1">ເວລາມາດຕະຖານ: 05:00 PM</p>
        </div>

        <div className="mt-6">
          {todayStatus.checkOut ? (
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-4 rounded-2xl font-bold text-sm">
              <CheckCircle size={18} /> Checked Out at {todayStatus.checkOut}
            </div>
          ) : (
            <button
              onClick={onCheckOut}
              disabled={!todayStatus.checkIn} // ຖ້າຍັງບໍ່ທັນກົດເຂົ້າງານ ຈະຫ້າມກົດອອກງານ
              className={`w-full flex items-center justify-center gap-2 py-4 font-bold text-sm rounded-2xl transition-all ${
                todayStatus.checkIn 
                  ? "bg-slate-800 hover:bg-slate-900 text-white shadow-lg shadow-slate-200" 
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              <LogOut size={18} /> ກົດອອກເວລາງານ
            </button>
          )}
        </div>
      </div>

    </div>
  );
}