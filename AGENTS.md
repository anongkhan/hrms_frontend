<!-- BEGIN:nextjs-agent-rules -->
@AGENTS.md

## Overview project
- ระบบ HRMS
- มี 4 role admin, hr, accounting, employee
- employee มีหน้าที่แค่กดเข้างาน การขอลา
- hr เพี่ม, ลบ, แก้ไขข้อมูนตำแหน่ง และ แผนกได้สามารถดูการมาสายหรือการขาดงานของพนักงานได้
- accounting กดจ่ายเงินให้แก่พนักงานสร้างรายงาน
- ระบบจะต้องคำนวณเงินเดือนพื้นฐานตามนำแหน่ง, คำนวณ OT, ค่า tax 5%, 
ค่าประกันสังคม 5.5% แบบอัตโนมัติ
- admin เห็นคบทุกหน้า


## ความสัมพันธ์ ER Model

| ลำดับ | Entity หลัก | Entity ที่เกี่ยวข้อง | ความสัมพันธ์ | ความหมาย                             |
| ----- | ----------- | -------------------- | ------------ | ------------------------------------ |
| 1     | Department  | Employee             | 1 : M        | 1 แผนกมีพนักงานหลายคน                |
| 2     | Position    | Employee             | 1 : M        | 1 ตำแหน่งมีพนักงานหลายคน             |
| 3     | Employee    | Attendance           | 1 : M        | 1 พนักงานมีข้อมูลเข้างานหลายรายการ   |
| 4     | Employee    | Leave                | 1 : M        | 1 พนักงานมีรายการลาหลายรายการ        |
| 5     | Employee    | Payroll              | 1 : M        | 1 พนักงานมีข้อมูลเงินเดือนหลายรายการ |
| 6     | Employee    | Bank_Account         | 1 : 1        | 1 พนักงานมีบัญชีธนาคาร 1 บัญชี       |
| 7     | Employee    | OT                   | 1 : M        | 1 พนักงานมีข้อมูล OT หลายรายการ      |

## Database
* ชื่อ database hrms_db      
- table name

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

## Tech Stack
- Nextjs 16
- Tailwind CSS 
- Nodejs
- Express
- Database
- Mysql

## Structure



