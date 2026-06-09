"use client";
import { useState } from "react";
import PayrollOverview from "./_components/PayrollOverview";
import PayrollFilter from "./_components/PayrollFilter";
import PayrollTable from "./_components/PayrollTable";

export default function PayrollPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("May 2026");

  // ຈຳລອງຂໍ້ມູນການຄິດໄລ່ເງິນເດືອນ (Mock Data)
  const [payrollData, setPayrollData] = useState([
    { empId: "EMP-001", name: "Anongkhan Zaiyaphon", position: "HR Manager", basicSalary: 5500000, allowance: 450000, deduction: 0, status: "Pending" },
    { empId: "EMP-002", name: "Somxai PTL", position: "Senior Accountant", basicSalary: 4500000, allowance: 200000, deduction: 150000, status: "Pending" },
    { empId: "EMP-003", name: "Sengdavone Dev", position: "Fullstack Developer", basicSalary: 8000000, allowance: 1200000, deduction: 80000, status: "Paid" },
  ]);

  // Logic ຕອນກົດຈ່າຍເງິນ (ປ່ຽນສະຖານະເປັນ Paid)
  const handlePaySalary = (id) => {
    setPayrollData(prev => prev.map(item => 
      item.empId === id ? { ...item, status: "Paid" } : item
    ));
  };

  // ຄົ້ນຫາລາຍຊື່
  const filteredData = payrollData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ຄຳນວນຍອດລວມສຳລັບກາດ Overview ດ້ານເທິງ (ຄຳນວນແບບ Dynamic ເລີຍ)
  // const totalSalary = payrollData.reduce((sum, item) => sum + item.basicSalary, 0);
  // const totalBonus = payrollData.reduce((sum, item) => sum + item.allowance, 0);
  // const totalDeduction = payrollData.reduce((sum, item) => sum + item.deduction, 0);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Payroll Calculation</h1>
        {/* <p className="text-sm text-slate-400 mt-1">ຄິດໄລ່ເງິນເດືອນພະນັກງານ, ຄ່າກາຍໂມງ (OT), ລາຍຫັກມາຊ້າ ແລະ ຈັດການການໂອນເງິນເດືອນ</p> */}
      </div>

      {/* 1. Component ກາດສະຫຼຸບຍອດລວມ */}
      {/* <PayrollOverview 
        totalSalary={totalSalary} 
        totalBonus={totalBonus} 
        totalDeduction={totalDeduction} 
      /> */}

      {/* 2. Component ຕົວເລືອກເດືອນ ແລະ คົ້ນຫາ */}
      <PayrollFilter 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        selectedMonth={selectedMonth} 
        setSelectedMonth={setSelectedMonth} 
      />

      {/* 3. Component ຕາຕະລາງຄຳນວນເງິນເດືອນ */}
      <PayrollTable 
        payrollData={filteredData} 
        onPaySalary={handlePaySalary} 
      />
    </div>
  );
}