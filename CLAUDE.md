@AGENTS.md

role มี4 admin, hr, accounting, employee
- employee ให้เห็นแค่หน้า dashboard, attendance, leave สำหรับ employee ไม่ให้เห็น fields action ให้เห็นแค่ fields Leave Type	Duration	Reason	Status
- hr ให้เห็น  dashboard, employee, attendance, leave หน้าการลาให้เห็นแค่ส่วนของตรงประวัติการลาเพราะ hr จะต้องเป็นคนกดอนุมัด
- accounting ให้เห็นแค่หน้า payroll, reports, หน้า payroll ระบบจะต้องคำนวณเงินเดือนอัตโนมัติ ค่า tax 5% ค่าประกันสังคมตามกดหมายของประเทดลาว
- admin จะค้องเห็นคบทุกหน้า

ในส่วนของ frontend ui ตามนั้นเลยไม่ต้องไปแตะอะไรเพิ่มทำแค่ในส่วนของ backend อย่างเดียวคือ config database สร้าง api ตาม role ข้างบนชื่อ table ของ database ดูได้ตามข้างล่างนี้เลยหลังจากสร้าง api เสร็จแล้วให้ข้อมูนสำหรับการ test api ด้วย

ความสัมพันธ์

| ลำดับ | Entity หลัก | Entity ที่เกี่ยวข้อง | ความสัมพันธ์ | ความหมาย                             |
| ----- | ----------- | -------------------- | ------------ | ------------------------------------ |
| 1     | Department  | Employee             | 1 : M        | 1 แผนกมีพนักงานหลายคน                |
| 2     | Position    | Employee             | 1 : M        | 1 ตำแหน่งมีพนักงานหลายคน             |
| 3     | Employee    | Attendance           | 1 : M        | 1 พนักงานมีข้อมูลเข้างานหลายรายการ   |
| 4     | Employee    | Leave                | 1 : M        | 1 พนักงานมีรายการลาหลายรายการ        |
| 5     | Employee    | Payroll              | 1 : M        | 1 พนักงานมีข้อมูลเงินเดือนหลายรายการ |
| 6     | Employee    | Bank_Account         | 1 : 1        | 1 พนักงานมีบัญชีธนาคาร 1 บัญชี       |
| 7     | Employee    | OT                   | 1 : M        | 1 พนักงานมีข้อมูล OT หลายรายการ      |

* ชื่อ database hrms_db      
  table name

- department 
  Field Name	Data Type	Key	Reference
  Dep_ID  	Varchar(10)	PK
  Dep_Name	Varchar(100)

- employee
  Field Name	Data Type	Key	Reference
  Emp_ID  	Varchar(15)	PK	
  Dep_ID  	Varchar(10)	FK	Department
  Pos_id  	Int(11)		FK	Position
  Full_name  	Varchar(100)
  Tel  		Varchar(10)
  Address  	Varchar(255)
  Email  	Varchar(100)
  Password	Varchar(255) 
  Gender	Varchar(20)
  Role		Varchar(20)

- attendance
  Field Name	Data Type	Key	Reference
  Att_id	Int(11)		PK
  Emp_id	Varchar(15)	FK	Emphoyee
  Work_Date	date
  Check_in	Timestamp
  Check_out	Timestamp

- positon
  Field Name	Data Type	Key	Reference
  Pos_id	Int(11)		PK
  Pos_name	Varchar(100)
  Base_salary	Int(11)

- leave
  Field Name	Data Type	Key	Reference
  Leave_id	Int(11)		PK
  Emp_id	Varchar(15)	FK	Emphoyee
  Leave_type	Varchar(100)
  Start_date	Date
  End_date	Date
  Reason	Varchar(100)
  Status	Varchar(100)

- ot
  Field Name	Data Type	Key	Reference
  OT_id		Int(11)		PK
  Emp_id	Varchar(15)	FK	Emphoyee
  OT_date	Date
  Hours		Decimal(4,2)

- bank_account
  Field Name	Data Type	Key	Reference
  Acc_id	Int(11)		PK
  Emp_id	Varchar(15)	FK	Emphoyee
  Acc_name	Varchar(100) 
  Acc_number	Varchar(255)

- payroll
  Field Name	Data Type	K
  ey	Reference
  Pay_id	Int(11)		PK
  Emp_id	Varchar(15)	FK	Emphoyee
  Pay_Month	Int(11)
  Pay_Year	Int(11)
  Total_ot	Decimal(15,2)
  Tax_amount	Decimal(15,2)
  Social_sec	Decimal(15,2)
  Net_salary	Decimal(15,2)
  Pay_date	Date

---

# แผนงานอนาคต: Audit Log (ยังไม่ทำ — รอสั่ง)

> บันทึกไว้สำหรับอนาคต เมื่อจะเปิดให้ HR / Accounting / Admin แก้ไขข้อมูลได้
> เป้าหมาย: ตอบให้ได้ว่า "ใครแก้ อะไร เมื่อไหร่ จากค่าอะไรเป็นค่าอะไร" (กรณีข้อมูลผิด/ตรวจสอบย้อนหลัง)
> ทำที่ **backend (d:\hrms-backend) เท่านั้น** — frontend UI ไม่ต้องแตะ จนกว่าจะถึงขั้น "หน้า View Logs"
> หมายเหตุ: `authMiddleware` ใส่ `req.user = { empId, role }` ให้ทุก request แล้ว → รู้ "ใคร" ได้ทันที

## ลำดับการทำ (ทำตามนี้)

### ขั้น 1 — สร้างตาราง `audit_log` (เพิ่มใน schema.sql)
```sql
CREATE TABLE audit_log (
    Log_id      INT          NOT NULL AUTO_INCREMENT,
    Emp_id      VARCHAR(15),              -- ใครทำ (req.user.empId)
    Action      VARCHAR(20),             -- CREATE / UPDATE / DELETE
    Table_name  VARCHAR(50),             -- แก้ตารางไหน เช่น 'employee'
    Record_id   VARCHAR(50),             -- แก้ record ไหน เช่น 'EMP-003'
    Old_value   JSON,                    -- ค่าเดิม (ก่อนแก้)
    New_value   JSON,                    -- ค่าใหม่ (หลังแก้)
    Created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Log_id),
    CONSTRAINT fk_audit_emp FOREIGN KEY (Emp_id) REFERENCES employee (Emp_ID) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### ขั้น 2 — สร้าง helper `utils/audit.js`
```js
const db = require('../config/db');

async function writeAuditLog({ empId, action, table, recordId, oldValue = null, newValue = null }) {
  await db.execute(
    `INSERT INTO audit_log (Emp_id, Action, Table_name, Record_id, Old_value, New_value)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [empId, action, table, recordId,
     oldValue ? JSON.stringify(oldValue) : null,
     newValue ? JSON.stringify(newValue) : null]
  );
}
module.exports = { writeAuditLog };
```

### ขั้น 3 — เสียบใน controller (หัวใจ: ก่อน UPDATE/DELETE ต้อง SELECT ค่าเก่าเก็บก่อน)
ตัวอย่างใน `updateEmployee`:
```js
const [before] = await db.execute('SELECT * FROM employee WHERE Emp_ID = ?', [id]);
// ...ทำ UPDATE ตามปกติ...
await writeAuditLog({
  empId: req.user.empId, action: 'UPDATE', table: 'employee',
  recordId: id, oldValue: before[0], newValue: req.body,
});
```

## ลำดับความสำคัญของ endpoint ที่ควร log
1. `updateEmployee`, `deleteEmployee` — กระทบข้อมูลคน + เงินเดือนมากสุด (เริ่มที่นี่)
2. `updateLeaveStatus` (อนุมัติลา) — การตัดสินใจของ HR
3. `markPayrollPaid` — เกี่ยวกับเงิน
4. `createEmployee` — รู้ว่าใครเพิ่มเข้ามา

## ทำทีหลังได้ (ขั้นสูง)
- Middleware ดักทุก POST/PUT/DELETE แล้ว log ให้อัตโนมัติ (แทนการเสียบทีละ controller)
- API `GET /api/audit` (เฉพาะ Admin) + หน้า frontend แสดงตาราง log ย้อนหลัง

## Tech Stack
- Nextjs 16
- Tailwind CSS 
- Nodejs
- Express
- Database
- Mysql

## Structure



