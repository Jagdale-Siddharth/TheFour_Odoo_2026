# TransitOps — Frontend (Member 4: Dashboard, Reports, Analytics, UI/Integration)

Scaffold for the Frontend Lead role in the TransitOps hackathon project. This is
**not** a CRUD module — it owns the shell every other module plugs into:
layout, navigation, dashboard, reports, global reusable components, and the
final integration wiring.

## Stack

React 19 · Vite · Tailwind CSS v4 · React Router · Axios · React Toastify · Recharts · Lucide Icons

## Getting started

```bash
npm install
cp .env.example .env   # already done, edit if your teammate's API runs elsewhere
npm run dev
```

Open the printed localhost URL. Login is a placeholder — any email/password
works right now (see "Mock mode" below). Try `dispatch@transitops.com` to see
the Dispatcher role, anything else logs in as Fleet Manager.

## Folder structure

```
src/
  components/
    common/       Button, Card, Table, Modal, ConfirmDialog, StatusBadge,
                   Spinner, EmptyState, ErrorState, SearchBar, FilterDropdown,
                   Pagination, ModulePlaceholder
    dashboard/    KpiCard
    charts/       ChartCard + one component per chart (Recharts)
    layout/       Sidebar, Navbar
    reports/      ReportSection (search + export + table, reused 5x)
    navigation/   ProtectedRoute
  contexts/       AuthContext (token/role state)
  hooks/          useApi (loading/error/refetch for any service call)
  layouts/        DashboardLayout (Sidebar + Navbar + <Outlet/>)
  pages/          Dashboard, Reports, Settings, Login, NotFound,
                   + one placeholder page per teammate's module
  services/
    api/          ONE axios instance (httpClient.js) + one *.service.js
                   file per domain (dashboard, reports, auth)
    mock/         mockData.js — realistic fleet/trip/fuel/expense records
  constants/      status.js (shared status enums + color map), navigation.js
  utils/          format.js (currency/number), exportCsv.js
```

## Mock mode → real API, in one step

Every service file (`src/services/api/*.service.js`) already branches on a
single flag:

```js
export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';
```

Right now `VITE_USE_MOCK=true` in `.env`, so the Dashboard and Reports pages
run entirely on the realistic data in `src/services/mock/mockData.js` —
correct shapes, correct status enums, simulated network latency, so loading
skeletons and empty/error states are honestly testable before any backend
exists.

Once a teammate's real endpoint is live:
1. Flip `VITE_USE_MOCK=false` in `.env` (or per-service if you want a gradual cutover).
2. Nothing in `pages/` or `components/` changes — they only ever call the
   exported service functions (`getDashboardSummary()`, `getVehicleSummaryReport()`, etc).

## Status enums (shared contract)

`src/constants/status.js` mirrors the frozen enums from the master brief
(`VEHICLE_STATUS`, `DRIVER_STATUS`, `TRIP_STATUS`, `MAINTENANCE_STATUS`) plus a
`STATUS_COLOR_MAP` that drives the **status rail** — the one signature visual
device used consistently on KPI cards, badges, and the sidebar's active item:
a colored left border borrowed from a real dispatch board's signal convention.
Never hardcode a status string outside this file.

## What's stubbed for teammates

`/vehicles`, `/drivers`, `/trips`, `/maintenance`, `/fuel`, `/expenses` render
`ModulePlaceholder` for now — routing, layout, and sidebar links are fully
wired, so each teammate only needs to drop their page content in
`src/pages/<Name>.jsx` and add a `<Name>.service.js` under `src/services/api/`
following the same pattern as `dashboard.service.js`.

`/login` is a working placeholder hitting a mock JWT — Member 1 replaces
`src/services/api/auth.service.js`'s real branch with `POST /auth/login`.

## Notes on the DB engine

This scaffold only talks to REST endpoints, so MySQL vs PostgreSQL on the
backend is invisible here. Flag to whoever owns `schema.prisma`: set
`provider = "mysql"`, and double check enum handling and `AUTO_INCREMENT` ids
translate cleanly from the original Postgres-oriented plan.

## Design notes

Palette is a cool "operations console" slate + steel-teal (`--color-primary:
#205072`), not the default warm-cream/terracotta look — deliberately built for
long dashboard viewing sessions. Headings use Space Grotesk, body text Inter,
and all IDs/figures/dates use IBM Plex Mono (`.font-mono-data`) for a
manifest/dispatch-board feel and easy scanning of numbers.
