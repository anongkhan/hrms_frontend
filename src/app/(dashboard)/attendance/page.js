"use client";
import { useState } from "react";
import AttendancePunch from "./_components/AttendancePunch";
import AttendanceHistory from "./_components/AttendanceHistory";

export default function AttendancePage() {
  // ສະຖານະການກົດຂອງມື້ນີ້
  const [todayStatus, setTodayStatus] = useState({ checkIn: null, checkOut: null });

  // ປະຫວັດການມາວຽກຈຳລອງ (Mock Data)
  const [history, setHistory] = useState([
    { date: "18-05-2026", checkIn: "07:54:20", checkOut: "17:02:11", status: "On Time", note: "Normal working day" },
    { date: "17-05-2026", checkIn: "08:12:05", checkOut: "17:05:00", status: "Late", note: "Traffic jam" },
    { date: "16-05-2026", checkIn: "07:45:12", checkOut: "17:00:30", status: "On Time", note: "Normal working day" },
  ]);

  // 🛠️ Logic ຕອນກົດເຂົ້າງານ
  const handleCheckIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", { hour12: false });
    
    // ເຊັກ Logic ວ່າ ມາຊ້າ ຫຼື ມາກົງເວລາ (ສົມມຸດໃຫ້ເຂົ້າວຽກກ່ອນ 08:00 AM)
    const isLate = now.getHours() >= 8 && now.getMinutes() > 0;
    const currentStatus = isLate ? "Late" : "On Time";

    setTodayStatus(prev => ({ ...prev, checkIn: timeString }));
    
    // ເພີ່ມເຂົ້າໄປໃນປະຫວັດ
    const newRecord = {
      date: now.toLocaleDateString("en-GB").replace(/\//g, "-"),
      checkIn: timeString,
      checkOut: null,
      status: currentStatus,
      // note: isLate ? "มาสายเกินเวลาที่กำหนด" : "เข้างานตรงเวลา"
    };
    setHistory([newRecord, ...history]);
  };

  // 🛠️ Logic ຕອນກົດອອກງານ
  const handleCheckOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", { hour12: false });

    setTodayStatus(prev => ({ ...prev, checkOut: timeString }));

    // ອັບເດດເວລາອອກໃນ Record ລ້າສຸດຂອງປະຫວັດ
    setHistory(prevHistory => {
      const updated = [...prevHistory];
      if (updated.length > 0) {
        updated[0].checkOut = timeString;
      }
      return updated;
    });
  };

  return (
    <div className="space-y-8">
      {/* Title Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Time Attendance</h1>
        {/* <p className="text-sm text-slate-400 mt-1">ບັນທຶກເວລາງານປະຈຳວັນ ແລະ ກວດສອບສະຖິຕິການມາເຮັດວຽກ</p> */}
      </div>

      {/* 1. Component ປຸ່ມກົດເຂົ້າ-ອອກວຽກ */}
      <AttendancePunch 
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        todayStatus={todayStatus}
      />

      {/* 2. Component ຕາຕະລາງປະຫວັດ */}
      <AttendanceHistory history={history} />
    </div>
  );
}