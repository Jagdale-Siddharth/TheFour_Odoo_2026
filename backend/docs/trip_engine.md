# Trip Engine Module (Member 3)

Owns: Trips, Dispatch, Fuel Logs, Expenses.

## Folder layout

```
src/
  config/db.js            Prisma client singleton
  constants/               status.js, expenseTypes.js - single source of truth for enum strings
  middleware/              auth.js (JWT verify only), validate.js (Zod), errorHandler.js
  validators/              Zod schemas per resource
  repositories/            Prisma queries only, zero business logic
  services/                business rules + integration clients
  controllers/             thin - parse request, call service, return standard envelope
  routes/                  Express routers, one per resource
```

## Integration boundary with Member 2 (Vehicle/Driver)

We never query a Vehicle or Driver table. All reads/writes go through
`services/vehicleApiClient.js` and `services/driverApiClient.js`, which wrap
their REST API with axios. If their actual route paths or response shapes
differ from the assumed contract documented at the top of each file, only
those two files need to change - nothing else in the Trip Engine touches
vehicle/driver data directly.

Assumed endpoints (confirm with Member 2):
- `GET /vehicles/:id` / `GET /drivers/:id`
- `PATCH /vehicles/:id/status` / `PATCH /drivers/:id/status`

## Dispatch workflow

`POST /api/trips/:id/dispatch` runs, in order:

1. Trip must currently be `DRAFT`.
2. Fetch vehicle + driver from Member 2's API.
3. Check our own Trip table for any other `DISPATCHED` trip already using
   this vehicle/driver (authoritative, in case their status field is stale).
4. Vehicle must be `AVAILABLE` (not `IN_SHOP`, `RETIRED`, or `ON_TRIP`).
5. Driver must be `AVAILABLE` (not `SUSPENDED`, `ON_TRIP`, or `OFF_DUTY`).
6. Driver license must not be expired.
7. Cargo weight must not exceed vehicle capacity.

If every check passes: vehicle → `ON_TRIP`, driver → `ON_TRIP`, trip →
`DISPATCHED`, `dispatchDate` set. If a later step in that chain fails, earlier
status changes are rolled back so nothing is left half-dispatched.

`POST /api/trips/:id/complete` requires `actualDistance` + `completionDate`,
sets trip → `COMPLETED`, and automatically frees vehicle + driver back to
`AVAILABLE`.

`POST /api/trips/:id/cancel` sets trip → `CANCELLED`. Only frees up
vehicle/driver if the trip had actually been dispatched (a cancelled `DRAFT`
trip never touched their status in the first place).

## Error messages

Every rejection throws an `AppError(message, statusCode)` with a specific,
user-facing message (e.g. "Vehicle is currently under maintenance") - never a
generic failure string. `middleware/errorHandler.js` is the only place that
converts thrown errors into the `{success, message, data}` response shape.

## What's still a TODO for you

- Confirm the real Vehicle/Driver API contract with Member 2 and adjust the
  two API client files if needed.
- Merge `prisma/schema.prisma` models into the team's single shared schema
  file (coordinate with Member 1 before running any migration).
- Frontend: Trip Management, Dispatch screen, Fuel/Expense pages (not built
  here - this pass covers backend only).
- Optional AI bonus: trip efficiency suggestions after completion.
