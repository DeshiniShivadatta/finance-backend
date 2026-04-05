# Finance Data Processing and Access Control Backend
-----------------------------------------------------------
A RESTful backend API for a finance dashboard system built with **Node.js**, **Express**, and **PostgreSQL**. 
The system supports role-based access control,financial record management, and dashboard-level analytics.
-----------------------------------------------------------
## Tech Stack
-----------------------------------------------------------
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
-----------------------------------------------------------
## Project Structure
-----------------------------------------------------------
finance-backend/
├── src/
│   ├── config/
│   │   └── db.js              --> PostgreSQL connection
│   ├── middleware/
│   │   └── auth.js            --> JWT authentication and role authorization
│   ├── controllers/
│   │   ├── authController.js      # Register and login logic
│   │   ├── userController.js      # User management logic
│   │   ├── recordController.js    # Financial records logic
│   │   └── dashboardController.js # Dashboard analytics logic
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── userRoutes.js      # User endpoints
│   │   ├── recordRoutes.js    # Record endpoints
│   │   └── dashboardRoutes.js # Dashboard endpoints
│   └── app.js                 # Main application entry point
├── .env                       # Environment variables
├── package.json
└── README.md

-----------------------------------------------------------
## API Reference
-----------------------------------------------------------
### Auth
-----------------------------------------------------------
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |
-----------------------------------------------------------
## sample Login Example 
-----------------------------------------------------------
// Request
{
  "email": "admin@finance.com",
  "password": "admin123"
}

// Response 200
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Super Admin",
    "email": "admin@finance.com",
    "role": "admin"
  }
}
-----------------------------------------------------------
### Users
-----------------------------------------------------------
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | Get all users |
| GET | `/api/users/:id` | Admin | Get user by ID |
| PUT | `/api/users/:id` | Admin | Update user role or status |
| DELETE | `/api/users/:id` | Admin | Delete a user |
-----------------------------------------------------------
### Financial Records
-----------------------------------------------------------
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/records` | All roles | Get all records with filters |
| GET | `/api/records/:id` | All roles | Get single record |
| POST | `/api/records` | Admin | Create a new record |
| PUT | `/api/records/:id` | Admin | Update a record |
| DELETE | `/api/records/:id` | Admin | Soft delete a record |
-----------------------------------------------------------
### Dashboard

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/summary` | All roles | Total income, expenses, net balance |
| GET | `/api/dashboard/recent` | All roles | Last 10 financial activities |
| GET | `/api/dashboard/categories` | Analyst, Admin | Category wise totals |
| GET | `/api/dashboard/trends/monthly` | Analyst, Admin | Monthly income and expense trends |
| GET | `/api/dashboard/trends/weekly` | Analyst, Admin | Weekly income and expense trends |
---------------------------------------------------------------------------------------------------
## Roles and Permissions
-----------------------------------------------------------

| Action                | Viewer | Analyst | Admin |
| --------------------- | ------ | ------- | ----- |
| View Dashboard        | ✅      | ✅       | ✅     |
| View Records          | ❌      | ✅       | ✅     |
| Create Records        | ❌      | ❌       | ✅     |
| Update/Delete Records | ❌      | ❌       | ✅     |
| Manage Users          | ❌      | ❌       | ✅     |
| View Analytics        | ❌      | ✅       | ✅     |
-----------------------------------------------------------
## Key Features
-----------------------------------------------------------
- **JWT Authentication**         — Secure token based login system
- **Role Based Access Control**  — Three roles with different permission levels
- **Financial Records CRUD**     — Full create, read, update, delete support
- **Soft Delete**                — Records are never permanently deleted, just marked as deleted
- **Filtering and Pagination**   — Filter records by type, category, and date range
- **Dashboard Analytics**        — Summary, category totals, monthly and weekly trends
- **Input Validation**           — All endpoints validate input and return meaningful errors
- **Error Handling**             — Consistent error responses with appropriate status codes
------------------------------------------------------------------------------------------------------
##  Design Decisions
--------------------------------------------------------------
* **PostgreSQL** → Strong relational integrity for financial data
* **JWT Authentication** → Stateless and scalable
* **RBAC Middleware** → Centralized access control
* **Soft Delete** → Preserves financial history
--------------------------------------------------------------