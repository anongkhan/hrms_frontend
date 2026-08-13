"use client";
import { useState, useEffect } from "react";
import { LogIn, LogOut, Clock, CheckCircle } from "lucide-react";

// ຕ້ອງກົງກັບ CHECK_IN_WINDOW / CHECK_OUT_WINDOW ໃນ attendanceController.js ຝັ່ງ backend
const CHECK_IN_WINDOW = { start: "08:00:00", end: "10:00:00" };
const CHECK_OUT_WINDOW = { start: "17:00:00", end: "19:00:00" };

function isWithinWindow(time, window) {
  return time >= window.start && time <= window.end;
}

export default function AttendancePunch({ onCheckIn, onCheckOut, todayStatus }) {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTimeRaw, setCurrentTimeRaw] = useState("");

  // ເຮັດໃຫ້ໂມງແລ່ນແບບ Real-time ທຸກໆ 1 ວິນາທີ
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
      setCurrentTimeRaw(now.toTimeString().slice(0, 8));
      // ໃຊ້ en-US (ພາສາອັງກິດ) ເພາະ browser ບໍ່ມີ locale ລາວ ເລີຍ fallback ໄປເປັນໄທ
      setCurrentDate(now.toLocaleDateString("en-US", {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        calendar: 'gregory', numberingSystem: 'latn'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const canCheckIn = !currentTimeRaw || isWithinWindow(currentTimeRaw, CHECK_IN_WINDOW);
  const canCheckOut = !currentTimeRaw || isWithinWindow(currentTimeRaw, CHECK_OUT_WINDOW);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* 🔴 Card ໂມງເວລາປັດຈຸບັນ */}
      <div className="bg-slate-900 text-white p-8 rounded-4xl flex flex-col justify-center items-center shadow-xl shadow-slate-900/10 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-white/5 pointer-events-none">
          <Clock size={160} />
        </div>
        <p className="text-xs uppercase font-bold text-blue-400 tracking-widest mb-2">{currentDate}</p>
        <h2 className="text-4xl font-black tracking-tight font-mono">{currentTime}</h2>
        {/* <p className="text-xs text-slate-400 mt-2">PTL Capital Server Time</p> */}
      </div>

      {/* 🟢 Card ປຸ່ມກົດ ເຂົ້າງານ (Check In) */}
      <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          {/* <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Shift Start</span> */}
          <h3 className="text-lg font-bold text-slate-800">ເວລາເຂົ້າວຽກ</h3>
          <p className="text-xs text-slate-400 mt-1">
            ເວລາມາດຕະຖານ: {CHECK_IN_WINDOW.start.slice(0, 5)} AM - {CHECK_IN_WINDOW.end.slice(0, 5)} AM
          </p>
        </div>

        <div className="mt-6">
          {todayStatus.checkIn ? (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-4 rounded-2xl font-bold text-sm">
              <CheckCircle size={18} /> Checked In at {todayStatus.checkIn}
            </div>
          ) : (
            <>
              <button
                onClick={onCheckIn}
                disabled={!canCheckIn}
                className={`w-full flex items-center justify-center gap-2 py-4 active:scale-[0.99] font-bold text-sm rounded-2xl transition-all ${
                  canCheckIn
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                <LogIn size={18} />ເຂົ້າວຽກ
              </button>
              {!canCheckIn && (
                <p className="text-xs text-rose-500 mt-2 text-center">
                  ຍັງບໍ່ຮອດ ຫຼື ເລີຍຊ່ວງເວລາເຂົ້າວຽກແລ້ວ
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* 🔵 Card ປຸ່ມກົດ ອອກງານ (Check Out) */}
      <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          {/* <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Shift End</span> */}
          <h3 className="text-lg font-bold text-slate-800">ເວລາອອກວຽກ</h3>
          <p className="text-xs text-slate-400 mt-1">
            ເວລາມາດຕະຖານ: {CHECK_OUT_WINDOW.start.slice(0, 5)} AM - {CHECK_OUT_WINDOW.end.slice(0, 5)} AM
          </p>
        </div>

        <div className="mt-6">
          {todayStatus.checkOut ? (
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-4 rounded-2xl font-bold text-sm">
              <CheckCircle size={18} /> Checked Out at {todayStatus.checkOut}
            </div>
          ) : (
            <>
              <button
                onClick={onCheckOut}
                disabled={!todayStatus.checkIn || !canCheckOut} // ຖ້າຍັງບໍ່ທັນກົດເຂົ້າງານ ຫຼື ຍັງບໍ່ຮອດຊ່ວງເວລາອອກ ຈະຫ້າມກົດອອກງານ
                className={`w-full flex items-center justify-center gap-2 py-4 font-bold text-sm rounded-2xl transition-all ${
                  todayStatus.checkIn && canCheckOut
                    ? "bg-slate-800 hover:bg-slate-900 text-white shadow-lg shadow-slate-200"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                <LogOut size={18} />ເລີກວຽກ
              </button>
              {todayStatus.checkIn && !canCheckOut && (
                <p className="text-xs text-rose-500 mt-2 text-center">
                  ຍັງບໍ່ຮອດ ຫຼື ເລີຍຊ່ວງເວລາອອກວຽກແລ້ວ
                </p>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
}