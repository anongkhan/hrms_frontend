"use client";
import { useState } from "react";
import DashboardStats from "./_components/DashboardStats";
import OverviewTable from "./_components/OverviewTable";

export default function DashboardPage() {
  // 1. ຂໍ້ມູນພະນັກງານທັງໝົດທຸກພະແນກ/ຕຳແໜ່ງ (Mock Data ທີ່ກຽມເຊື່ອມ API)
  const [allEmployees] = useState([
    { empId: "EMP-001", name: "Anongkhan Zaiyaphon", email: "anongkhan@email.com", department: "Human Resource", position: "HR Manager", status: "Active" },
    { empId: "EMP-002", name: "Somxai PTL", email: "somxai@email.com", department: "Accounting", position: "Senior Accountant", status: "Active" },
    { empId: "EMP-003", name: "Sengdavone Dev", email: "sengdavone@email.com", department: "IT Support", position: "Fullstack Developer", status: "Active" },
    { empId: "EMP-004", name: "Souphaphone Mit", email: "souphaphone@email.com", department: "Marketing", position: "Marketing Specialist", status: "Active" },
    { empId: "EMP-005", name: "Khamla Inthavong", email: "khamla@email.com", department: "IT Support", position: "UI/UX Designer", status: "Active" },
  ]);

  // ຄຳນວນຕົວເລກສະຖິຕິແບບດ່ວນ
  const totalEmp = allEmployees.length;
  const totalPresent = 4;   // ສົມມຸດຕົວເລກເຂົ້າງານມື້ນີ້
  const totalOnLeave = 1;   // ສົມມຸດຕົວເລກລາພັກມື້ນີ້

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        {/* <p className="text-sm text-slate-400 mt-1">ພາບລວມສະຖິຕິປະຈຳວັນ ແລະ ລາຍຊື່ບຸກຄະລາກອນທັງໝົດຂອງ PTL Capital</p> */}
      </div>

      {/* 1. Component ກາດສະຫຼຸບສະຖິຕິດ້ານເທິງ */}
      <DashboardStats 
        totalEmp={totalEmp} 
        totalPresent={totalPresent} 
        totalOnLeave={totalOnLeave} 
      />

      {/* 2. Component ຕາຕະລາງລວມພະນັກງານທຸກພະແນກ */}
      <OverviewTable employees={allEmployees} />
    </div>
  );
}