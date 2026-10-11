# SmartPark EPMS — Employee Payroll Management System
**National Practical Exam 2024-2025 | TSS SWD**
**Student:** Nisingizwe Rukundo
**Location:** Rubavu District, Western Province, Rwanda

---

## Project Structure
```
nisingizwe-rukundo-national-exam-2025/
├── backend-project/         # Node.js + Express REST API
│   ├── routes/
│   │   ├── auth.js          # Session login/logout
│   │   ├── employees.js     # Employee CRUD (INSERT)
│   │   ├── departments.js   # Department CRUD (INSERT)
│   │   └── salary.js        # Salary full CRUD + reports
│   ├── db.js                # MySQL connection pool
│   ├── server.js            # Express server entry
│   ├── database.sql         # DB schema + seed data
│   └── .env                 # Environment variables
│
└── frontend-project/        # React.js + Tailwind CSS
    └── src/
        ├── context/AuthContext.js
        ├── components/Layout.js, ProtectedRoute.js
        └── pages/
            ├── Login.js
            ├── Dashboard.js
            ├── Employees.js
            ├── Departments.js
            ├── Salary.js
            └── Reports.js
```

---

## ERD Summary

### Entities & Relationships:
- **Department** (DepartmentCode PK, DepartmentName, GrossSalary)
- **Employee** (EmployeeNumber PK, FirstName, LastName, Position, Address, Telephone, Gender, HiredDate, DepartmentCode FK)
- **Salary** (SalaryID PK, EmployeeNumber FK, GrossSalary, TotalDeduction, NetSalary [computed], Month)

**Cardinalities:**
- Department → Employee: 1 to Many (one department has many employees)
- Employee → Salary: 1 to Many (one employee has many salary records)

---

## Setup Instructions

### Step 1: Database Setup
1. Open MySQL Workbench or MySQL CLI
2. Run `backend-project/database.sql`
3. This creates the EPMS database with all tables and default data

### Step 2: Backend Setup
```bash
cd backend-project
npm install
# Edit .env with your MySQL credentials
npm run dev
# Server starts on http://localhost:5000
```

### Step 3: Frontend Setup
```bash
cd frontend-project
npm install
npm start
# App opens on http://localhost:3000
```

### Default Login Credentials
- **Username:** `admin`
- **Password:** `admin123`

> To create the admin user, run this in MySQL after setting up the DB:
> ```sql
> INSERT INTO Users (Username, Password) VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
> ```
> (This is bcrypt hash for 'admin123')
>
> Or use the register endpoint: `POST http://localhost:5000/api/auth/register`
> Body: `{ "username": "admin", "password": "admin123" }`

---

## Features
- ✅ Session-based authentication (login/logout)
- ✅ Employee management (INSERT)
- ✅ Department management (INSERT)
- ✅ Salary management (INSERT, UPDATE, DELETE, RETRIEVE)
- ✅ Monthly payroll report (filterable by month)
- ✅ Responsive design with Tailwind CSS
- ✅ React Router navigation
- ✅ Axios integration (frontend ↔ backend)
- ✅ MySQL database with proper FK constraints

---

## Department Data (Pre-loaded)
| Code | Department | Gross Salary | Deduction |
|------|-----------|-------------|-----------|
| CW | Carwash | 300,000 RWF | 20,000 RWF |
| ST | Stock | 200,000 RWF | 5,000 RWF |
| MC | Mechanic | 450,000 RWF | 40,000 RWF |
| ADMS | Administration Staff | 600,000 RWF | 70,000 RWF |

---

*SmartPark EPMS | TSS National Integrated Assessment 2024–2025*
