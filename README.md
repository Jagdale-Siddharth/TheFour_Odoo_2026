# TransitOps — Smart Transport Operations Platform

A full-stack fleet operations platform: vehicle registry, driver management, trip
dispatch, maintenance workflow, fuel & expense tracking, dashboard KPIs, and
reports/analytics — built against **PostgreSQL** (works with your local
pgAdmin/Postgres server).

**Stack:** Node.js + Express + PostgreSQL (`pg`) API · React (Vite) + Tailwind
CSS frontend · JWT auth with role-based access control (RBAC).

Tested end-to-end against a live PostgreSQL instance — every business rule in
the spec (cargo capacity checks, license/status validation, automatic status
transitions, maintenance lock-out, etc.) was exercised and verified before
delivery.

---

## 1. Set up the database (pgAdmin or psql)

1. Open pgAdmin (or `psql`) against your local Postgres server.
2. Create a new database, e.g. `transitops`:
   ```sql
   CREATE DATABASE transitops;
   ```
3. Open the Query Tool on the `transitops` database and run, in order:
   - `backend/schema.sql` — creates all tables, enums, and indexes.
   - `backend/seed.sql` — optional demo data (5 vehicles, 4 drivers, 4 users,
     sample trips/fuel/expenses). **Password for every seeded user is
     `password123`.**

## 2. Backend API

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your local Postgres credentials:

```
PGHOST=localhost
PGPORT=5432
PGDATABASE=transitops
PGUSER=postgres
PGPASSWORD=your_local_password
JWT_SECRET=some_long_random_string
```

Run it:

```bash
npm run dev      # nodemon, auto-restart
# or
npm start
```

The API listens on `http://localhost:5000`. Health check: `GET /api/health`.

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173` and proxies `/api` calls to the backend
(see `vite.config.js`). Log in with any seeded account, e.g.
`fleet@transitops.com` / `password123`.

## 4. Demo accounts (all password: `password123`)

| Role              | Email                       | Can do                                              |
|-------------------|------------------------------|------------------------------------------------------|
| Fleet Manager     | fleet@transitops.com         | Full access: vehicles, drivers, trips, maintenance   |
| Driver            | driver@transitops.com        | Create/dispatch/complete trips, log fuel             |
| Safety Officer    | safety@transitops.com        | Manage driver compliance & licensing                 |
| Financial Analyst | finance@transitops.com       | View reports, log expenses                           |

---

## What's implemented (mandatory deliverables)

- ✅ JWT authentication + Role-Based Access Control (4 roles)
- ✅ Dashboard with KPIs (active/available/in-maintenance vehicles, active/pending
  trips, drivers on duty, fleet utilization %) + type/status/region filters
- ✅ Vehicle Registry — full CRUD, unique registration number enforced
- ✅ Driver Management — full CRUD, license expiry & safety score tracking
- ✅ Trip Management with lifecycle **Draft → Dispatched → Completed / Cancelled**
- ✅ All mandatory business rules enforced server-side (see below)
- ✅ Maintenance workflow — creating a record auto-sets vehicle to "In Shop"
  and removes it from dispatch; closing restores "Available" (unless Retired)
- ✅ Fuel & expense logging with automatic operational cost roll-up
- ✅ Reports & Analytics — Fuel Efficiency, Fleet Utilization, Operational Cost,
  Vehicle ROI, CSV export
- ✅ Responsive UI, dark "dispatch board" design system

### Business rules enforced (backend, transactional)

- Registration numbers are unique (DB constraint + explicit check).
- Retired / In Shop vehicles never appear in `/vehicles/available` (the
  dispatch pool).
- Drivers with expired licenses or `Suspended` status are rejected at dispatch.
- A vehicle or driver already `On Trip` cannot be dispatched again.
- Cargo weight is validated against the vehicle's max load capacity both at
  trip creation and again at dispatch.
- Dispatching a trip atomically sets vehicle + driver to `On Trip`.
- Completing a trip atomically restores both to `Available`.
- Cancelling a `Dispatched` trip restores both to `Available`.
- Creating an open maintenance record sets the vehicle to `In Shop`; closing
  it restores `Available` unless the vehicle is `Retired`.

## Bonus features included

- Charts (bar/line via Recharts) on the Reports page
- CSV export of the full vehicle analytics table
- Search, filters and sorting on Vehicles/Drivers/Trips
- Visual expiring/expired license indicators on the Drivers page
- Dark, purpose-built "fleet command" UI theme (not implemented: PDF export,
  email reminders, document management, dark-mode toggle — the UI ships
  dark-only by design)

## Project structure

```
transitops/
├── backend/
│   ├── schema.sql        # run this first in pgAdmin
│   ├── seed.sql          # optional demo data
│   ├── .env.example
│   └── src/
│       ├── index.js
│       ├── db.js
│       ├── middleware/auth.js
│       └── routes/       # auth, vehicles, drivers, trips, maintenance, fuel, expenses, dashboard, reports
└── frontend/
    └── src/
        ├── pages/         # Login, Dashboard, Vehicles, Drivers, Trips, Maintenance, FuelExpenses, Reports
        ├── components/    # Shell (nav), Modal, StatusBadge, Form
        └── context/       # AuthContext (JWT + RBAC)
```
