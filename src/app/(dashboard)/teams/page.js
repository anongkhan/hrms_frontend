"use client";
import { useState } from "react";
import EmployeeList from "./_components/EmployeeList";
import EmployeeForm from "./_components/EmployeeForm";

export default function TeamsPage() {
  const [viewMode, setViewMode] = useState("list"); // 'list' ຫຼື 'form'
  
  // ກຸ່ມຂໍ້ມູນ (State ຫຼັກ)
  const [employees, setEmployees] = useState([
    { empId: "EMP-001", name: "Anongkhan Zaiyaphon", gender: "Female", tel: "020 55xx xxxx", email: "anongkhan@email.com", department: "Human Resource", position: "HR Manager", salary: 5500000, bankAccountNumber: "010-123456789", role: "HR" },
    { empId: "EMP-002", name: "Somxai PTL", gender: "Male", tel: "020 99xx xxxx", email: "somxai@email.com", department: "Accounting", position: "Senior Accountant", salary: 4500000, bankAccountNumber: "010-987654321", role: "Accountant" },
  ]);

  const [formData, setFormData] = useState({
    empId: "", name: "", gender: "Male", tel: "", email: "", department: "Human Resource", position: "HR Staff", salary: "", bankAccountNumber: "", role: "Employee"
  });

  // ກົດປຸ່ມ Add New ຈາກໜ້າ List
  const handleAddNew = () => {
    setFormData({
      empId: `EMP-00${employees.length + 1}`,
      name: "", gender: "Male", tel: "", email: "", department: "Human Resource", position: "HR Staff", salary: "", bankAccountNumber: "", role: "Employee"
    });
    setViewMode("form");
  };

  // ກົດ Save ຈາກໜ້າ Form
  const handleSave = (e) => {
    e.preventDefault();
    setEmployees([...employees, { ...formData, salary: Number(formData.salary) }]);
    setViewMode("list");
  };

  return (
    <>
      {viewMode === "list" ? (
        <EmployeeList 
          employees={employees} 
          onAddNew={handleAddNew} 
        />
      ) : (
        <EmployeeForm 
          formData={formData} 
          setFormData={setFormData} 
          onCancel={() => setViewMode("list")} 
          onSave={handleSave} 
        />
      )}
    </>
  );
}
