# Financial Dashboard

A full-stack financial management web application with JWT-based authentication and role-based access control (RBAC). Built with **Spring Boot** (backend), **React + Vite** (frontend), and **MySQL** (database).

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Backend   | Java 17, Spring Boot 3.2.5, Spring Security, Spring Data JPA |
| Auth      | JWT (jjwt 0.11.5), BCrypt password hashing      |
| API Docs  | SpringDoc OpenAPI 2.5.0 (Swagger UI)            |
| Frontend  | React 19, React Router DOM 7, Axios             |
| Build     | Vite 8, Maven                                   |
| Database  | MySQL 8                                         |

---

## Project Structure

```
financial-dashboard/
├── finance-dashboard/          # Spring Boot backend
│   └── src/main/java/com/finance/
│       ├── config/             # SecurityConfig (JWT filter chain)
│       ├── controller/         # AuthController, DashboardController,
│       │                       # FinancialRecordController, UserController
│       ├── dto/                # Request/Response DTOs
│       ├── entity/             # User, FinancialRecord (JPA entities)
│       ├── enums/              # Role, RecordType, UserStatus
│       ├── exception/          # GlobalExceptionHandler, custom exceptions
│       ├── repository/         # UserRepository, FinancialRecordRepository
│       ├── security/           # JwtUtil, JwtAuthenticationFilter,
│       │                       # CustomUserDetailsService
│       └── service/            # AuthService, UserService,
│                               # FinancialRecordService, DashboardService
│
└── finance-dashboard-ui/       # React frontend
    └── src/
        ├── api/                # axios.js (base URL + JWT interceptor)
        ├── components/         # Navbar, ProtectedRoute
        └── pages/              # LoginPage, RegisterPage, DashboardPage,
                                # RecordsPage, UsersPage, AccessDeniedPage
```

---

## Database Schema

**Database:** `finance_dashboard`

### `users` table

| Column       | Type         | Constraints                        |
|--------------|--------------|------------------------------------|
| id           | BIGINT       | PK, AUTO_INCREMENT                 |
| name         | VARCHAR      | NOT NULL                           |
| email        | VARCHAR      | NOT NULL, UNIQUE                   |
| password     | VARCHAR      | NOT NULL (BCrypt hashed)           |
| role         | ENUM         | ADMIN / ANALYST / VIEWER           |
| status       | ENUM         | ACTIVE / INACTIVE                  |
| created_at   | DATETIME     | NOT NULL, set on insert            |

### `financial_records` table

| Column       | Type          | Constraints                       |
|--------------|---------------|-----------------------------------|
| id           | BIGINT        | PK, AUTO_INCREMENT                |
| amount       | DECIMAL(15,2) | NOT NULL                          |
| type         | ENUM          | INCOME / EXPENSE                  |
| category     | VARCHAR       | NOT NULL                          |
| date         | DATE          | NOT NULL                          |
| notes        | VARCHAR(500)  | nullable                          |
| created_by   | BIGINT        | FK → users.id                     |
| created_at   | DATETIME      | set on insert                     |
| updated_at   | DATETIME      | updated on every save             |

---

## Roles & Permissions

| Feature                        | ADMIN | ANALYST | VIEWER |
|-------------------------------|:-----:|:-------:|:------:|
| Login / Register               | ✅    | ✅      | ✅     |
| View Dashboard (summary, trends, categories, recent) | ✅ | ✅ | ✅ |
| View all Records               | ✅    | ✅      | ✅     |
| Filter Records                 | ✅    | ✅      | ✅     |
| View single Record detail      | ✅    | ✅      | ✅     |
| Add / Edit / Delete Records    | ✅    | ❌      | ❌     |
| View Users list & detail       | ✅    | ❌      | ❌     |
| Update User Role               | ✅    | ❌      | ❌     |
| Activate / Deactivate User     | ✅    | ❌      | ❌     |

---

## JWT Authentication Flow

```
Client                          Server
  │                               │
  │── POST /api/auth/login ──────>│
  │   { email, password }         │  Validates credentials
  │                               │  Generates JWT (HS256, 24h expiry)
  │<── { token, email, role } ───│
  │                               │
  │  Stores token in localStorage │
  │                               │
  │── GET /api/records ──────────>│
  │   Authorization: Bearer <JWT> │  JwtAuthenticationFilter extracts
  │                               │  email + role from token claims
  │                               │  Sets SecurityContext
  │                               │  @PreAuthorize checks role
  │<── [ records ] ──────────────│
```

The JWT payload contains:
- `sub` — user email
- `role` — user role (e.g. `ROLE_ADMIN`)
- `iat` / `exp` — issued at / expiry (24 hours)

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint             | Access | Description        |
|--------|----------------------|--------|--------------------|
| POST   | `/api/auth/register` | Public | Register new user  |
| POST   | `/api/auth/login`    | Public | Login, returns JWT |

**Login request:**
```json
{ "email": "admin@example.com", "password": "password123" }
```
**Login response:**
```json
{ "token": "<jwt>", "email": "admin@example.com", "role": "ADMIN" }
```

---

### Dashboard — `/api/dashboard` *(All authenticated roles)*

| Method | Endpoint                          | Description                        |
|--------|-----------------------------------|------------------------------------|
| GET    | `/api/dashboard/summary`          | Total income, expense, net balance |
| GET    | `/api/dashboard/category-totals`  | Spending grouped by category       |
| GET    | `/api/dashboard/recent`           | Latest financial records           |
| GET    | `/api/dashboard/monthly-trends`   | Monthly income vs expense          |

---

### Financial Records — `/api/records`

| Method | Endpoint                | Access              | Description              |
|--------|-------------------------|---------------------|--------------------------|
| GET    | `/api/records`          | ADMIN, ANALYST, VIEWER | List all records      |
| GET    | `/api/records/{id}`     | ADMIN, ANALYST, VIEWER | Get record by ID      |
| GET    | `/api/records/filter`   | ADMIN, ANALYST, VIEWER | Filter by type/category/date |
| POST   | `/api/records`          | ADMIN only          | Create new record        |
| PUT    | `/api/records/{id}`     | ADMIN only          | Update record            |
| DELETE | `/api/records/{id}`     | ADMIN only          | Delete record            |

**Filter query params:** `type`, `category`, `startDate`, `endDate`

---

### Users — `/api/users` *(ADMIN only)*

| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| GET    | `/api/users`               | List all users           |
| GET    | `/api/users/{id}`          | Get user by ID           |
| PATCH  | `/api/users/{id}/role`     | Update user role         |
| PATCH  | `/api/users/{id}/status`   | Activate / Deactivate    |

---

## Swagger UI

Once the backend is running, the interactive API docs are available at:

```
http://localhost:2026/swagger-ui.html
```

To test protected endpoints in Swagger:
1. Call `POST /api/auth/login` to get a JWT token
2. Click the **Authorize** button (🔒) at the top right
3. Enter: `Bearer <your-token>`
4. All subsequent requests will include the token

---

## Screenshots

### Login Page
![Login Page](finance-dashboard-ui/src/assets/hero.png)

### ADMIN Role — Dashboard
> Full access: Dashboard, Records (add/edit/delete), Users management

### ANALYST Role — Dashboard
> Read access: Dashboard, Records (view + filter only), no Users tab

### VIEWER Role — Dashboard
> Read-only access: Dashboard, Records (view + filter only), no Users tab

> Add your screenshots to a `screenshots/` folder and update the paths above.

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

### 1. Database Setup

```sql
CREATE DATABASE finance_dashboard;
```

### 2. Backend Setup

Update `finance-dashboard/src/main/resources/application.properties` with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/finance_dashboard
spring.datasource.username=root
spring.datasource.password=your_password
```

Run the backend:

```bash
cd finance-dashboard
./mvnw spring-boot:run
```

Backend starts on `http://localhost:2026`

### 3. Frontend Setup

```bash
cd finance-dashboard-ui
npm install
npm run dev
```

Frontend starts on `http://localhost:5173`

---

## Environment Configuration

| Config                  | Value                          |
|-------------------------|--------------------------------|
| Backend port            | `2026`                         |
| Frontend dev port       | `5173`                         |
| JWT expiry              | 24 hours (86400000 ms)         |
| JWT algorithm           | HS256                          |
| Password hashing        | BCrypt                         |
| DB auto DDL             | `update` (auto-creates tables) |

---

## License

MIT
