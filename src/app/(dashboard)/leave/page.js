"use client";
import { useState } from "react";
import LeaveStats from "./_components/LeaveStats";
import LeaveForm from "./_components/LeaveForm";
import LeaveHistory from "./_components/LeaveHistory";

export default function LeavePage() {
  // 1. ໂຄຕ້າວັນລາຈຳລອງ (Mock Stats)
  const [leaveStats, setLeaveStats] = useState({
    sick: { used: 2, total: 6 },
    personal: { used: 1, total: 5 },
    vacation: { used: 4, total: 12 }
  });

  // 2. ປະຫວັດການລາຈຳລອງ (Mock History)
  const [history, setHistory] = useState([
    { type: "Vacation Leave", startDate: "2026-06-01", endDate: "2026-06-05", reason: "ໄປທ່ຽວພັກຜ່ອນຕ່າງປະເທດກັບຄອບຄົວ", status: "Pending" },
    { type: "Sick Leave", startDate: "2026-04-12", endDate: "2026-04-13", reason: "ເປັນໄຂ້ຫວັດໃຫຍ່ ໝໍໃຫ້ພັກຜ່ອນ", status: "Approved" },
    { type: "Personal Leave", startDate: "2026-02-10", endDate: "2026-02-10", reason: "ໄປເຮັດທຸລະກ່ຽວກັບເອກະສານທີ່ດິນ", status: "Approved" }
  ]);

  // 3. Logic ຕອນພະນັກງານກົດສົ່ງຄຳຮ້ອງຂໍລາ
  const handleLeaveSubmit = (newLeave) => {
    const formattedRecord = {
      ...newLeave,
      status: "Pending" // ທຸກໆການລາໃໝ່ ຈະຕັ້ງເປັນ Pending ເພື່ອຖ້າ HR ມາອະນຸມັດ
    };

    setHistory([formattedRecord, ...history]);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Leave Requests</h1>
        {/* <p className="text-sm text-slate-400 mt-1">ກວດສອບໂຄຕ້າວັນລາ, ສ້າງຄຳຮ້ອງຂໍລາພັກ ແລະ ຕິດຕາມສະຖານະການອະນຸມັດ</p> */}
      </div>

      {/* 1. Component ສະຫຼຸບວັນລາ */}
      <LeaveStats stats={leaveStats} />

      {/* 2. Component ຟອມກອກຄຳຮ້ອງ */}
      <LeaveForm onSubmitLeave={handleLeaveSubmit} />

      {/* 3. Component ຕາຕະລາງປະຫວັດ */}
      <LeaveHistory history={history} />
    </div>
  );
}