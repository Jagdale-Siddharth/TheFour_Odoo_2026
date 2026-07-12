# TransitOps — Backend Foundation (Member 1)

Owns: Database (MySQL) · Prisma · Authentication · RBAC · Shared Middleware

## Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your real MySQL credentials
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

Server runs on `http://localhost:5000` by default.
Health check: `GET /health`

## What's included

- `prisma/schema.prisma` — User model + Role/Status enums (MySQL)
- `config/` — env loader, Prisma client singleton
- `middleware/` — authMiddleware, roleMiddleware, errorMiddleware, notFoundMiddleware,
  requestLogger, validationMiddleware (shared by the whole team)
- `validators/` — Zod schemas for register/login/update
- `repositories/`, `services/`, `controllers/` — Controller → Service → Repository pattern
- `routes/index.js` — central router; other members mount their route files here
- `utils/` — apiResponse (standard response shape), AppError, JWT helpers, asyncHandler

## API Endpoints

| Method | Endpoint            | Auth              | Description         |
|--------|----------------------|-------------------|----------------------|
| POST   | /api/auth/register   | Public            | Register a new user |
| POST   | /api/auth/login      | Public            | Login, returns JWT   |
| POST   | /api/auth/logout     | Bearer token      | Logout (stateless)   |
| GET    | /api/auth/me         | Bearer token      | Current user profile |
| GET    | /api/users           | Bearer + FleetMgr | List users (paginated) |
| GET    | /api/users/:id       | Bearer token      | Get single user      |
| PUT    | /api/users/:id       | Bearer + FleetMgr | Update user          |
| DELETE | /api/users/:id       | Bearer + FleetMgr | Delete user          |

## Response format (frozen — do not change)

Success:
```json
{ "success": true, "message": "User Created", "data": {} }
```

Error:
```json
{ "success": false, "message": "Email already exists" }
```

## For other team members

- Import `authMiddleware` from `middleware/authMiddleware.js` to protect your routes.
- Import `authorize([...roles])` from `middleware/roleMiddleware.js` for RBAC.
- Import `success`/`error` from `utils/apiResponse.js` to keep response format consistent.
- Mount your routes inside `routes/index.js`.
- Do not edit this module's files directly — open an issue/message Member 1 if something's missing.

## Roles

`FLEET_MANAGER` · `DISPATCHER` · `SAFETY_OFFICER` · `FINANCIAL_ANALYST`

## Statuses

User: `ACTIVE` · `INACTIVE`
