"use client";
import { useCallback, useEffect, useState } from "react";
import EmployeeList from "./_components/EmployeeList";
import EmployeeForm from "./_components/EmployeeForm";
import { apiRequest } from "@/lib/api";
import { notifySuccess, notifyError, confirmDelete } from "@/lib/alert";

function mapEmployee(row) {
  return {
    empId: row.Emp_ID,
    name: row.Full_name,
    gender: row.Gender || "Male",
    tel: row.Tel || "",
    address: row.Address || "",
    email: row.Email || "",
    department: row.Dep_Name || "Human Resource",
    position: row.Pos_name || "",
    salary: Number(row.Base_salary || 0),
    bankAccountNumber: row.Acc_number || "",
    role: row.Role || "Employee",
  };
}

// ສ້າງ Emp_ID ຕໍ່ເນື່ອງ ໂດຍອີງຈາກເລກສູງສຸດທີ່ມີຢູ່ (ກັນຊ້ຳກັນເມື່ອມີການລຶບ)
function nextEmployeeId(employees) {
  const maxNum = (employees || []).reduce((max, emp) => {
    const match = /^EMP-(\d+)$/.exec(emp.empId || "");
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `EMP-${String(maxNum + 1).padStart(3, "0")}`;
}

const emptyForm = {
  empId: "",
  name: "",
  gender: "Male",
  tel: "",
  address: "",
  email: "",
  password: "",
  department: "Human Resource",
  position: "",
  salary: "",
  bankAccountNumber: "",
  role: "Employee",
};

export default function TeamsPage() {
  const [viewMode, setViewMode] = useState("list");
  const [formMode, setFormMode] = useState("create");
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadEmployees = useCallback(async () => {
    try {
      const rows = await apiRequest("/api/employees");
      setEmployees((rows || []).map(mapEmployee));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadEmployees]);

  const handleAddNew = () => {
    setFormData({
      ...emptyForm,
      empId: nextEmployeeId(employees),
    });
    setFormMode("create");
    setViewMode("form");
  };

  const handleEdit = (employee) => {
    setFormData({
      ...emptyForm,
      ...employee,
      salary: employee.salary ? String(employee.salary) : "",
    });
    setFormMode("edit");
    setViewMode("form");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const isEdit = formMode === "edit";
      const payload = {
        Full_name: formData.name,
        Gender: formData.gender,
        Tel: formData.tel,
        Address: formData.address,
        Email: formData.email,
        department: formData.department,
        position: formData.position,
        salary: Number(formData.salary || 0),
        Acc_name: formData.name,
        Acc_number: formData.bankAccountNumber,
        Role: formData.role,
      };

      if (formData.password) {
        payload.Password = formData.password;
      }

      // ສ້າງໃໝ່ → ສົ່ງ Emp_ID ທີ່ສະແດງໃນຟອມໄປບັນທຶກນຳ (ໃຫ້ກົງກັນ)
      if (!isEdit) {
        payload.Emp_ID = formData.empId;
      }

      await apiRequest(isEdit ? `/api/employees/${formData.empId}` : "/api/employees", {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      notifySuccess(isEdit ? "updated successfully" : "Employee created successfully");
      await loadEmployees();
      setViewMode("list");
      setFormMode("create");
    } catch (err) {
      notifyError(err.message);
      setError(err.message);
    }
  };

  const handleDelete = async (empId) => {
    const result = await confirmDelete(`${empId} will be permanently removed.`);
    if (!result.isConfirmed) return;

    try {
      await apiRequest(`/api/employees/${empId}`, { method: "DELETE" });
      notifySuccess("Employee deleted");
      await loadEmployees();
    } catch (err) {
      notifyError(err.message);
      setError(err.message);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
          {error}
        </div>
      )}

      {viewMode === "list" ? (
        <EmployeeList
          employees={employees}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <EmployeeForm
          mode={formMode}
          formData={formData}
          setFormData={setFormData}
          onCancel={() => {
            setViewMode("list");
            setFormMode("create");
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
