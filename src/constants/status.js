// Shared status constants. Frontend MUST mirror the backend enums exactly.
// Never hardcode these strings anywhere else in the app.

export const VEHICLE_STATUS = {
  AVAILABLE: 'AVAILABLE',
  ON_TRIP: 'ON_TRIP',
  IN_SHOP: 'IN_SHOP',
  RETIRED: 'RETIRED',
};

export const DRIVER_STATUS = {
  AVAILABLE: 'AVAILABLE',
  ON_TRIP: 'ON_TRIP',
  OFF_DUTY: 'OFF_DUTY',
  SUSPENDED: 'SUSPENDED',
};

export const TRIP_STATUS = {
  DRAFT: 'DRAFT',
  DISPATCHED: 'DISPATCHED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const MAINTENANCE_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

// Maps every status across all entities to a design token color + soft background.
// Powers the "status rail" signature element on cards, tables, and badges.
export const STATUS_COLOR_MAP = {
  [VEHICLE_STATUS.AVAILABLE]: { color: 'var(--color-success)', soft: 'var(--color-success-soft)', label: 'Available' },
  [VEHICLE_STATUS.ON_TRIP]: { color: 'var(--color-info)', soft: 'var(--color-info-soft)', label: 'On Trip' },
  [VEHICLE_STATUS.IN_SHOP]: { color: 'var(--color-warning)', soft: 'var(--color-warning-soft)', label: 'In Shop' },
  [VEHICLE_STATUS.RETIRED]: { color: 'var(--color-danger)', soft: 'var(--color-danger-soft)', label: 'Retired' },

  [DRIVER_STATUS.OFF_DUTY]: { color: 'var(--color-muted)', soft: 'var(--color-line)', label: 'Off Duty' },
  [DRIVER_STATUS.SUSPENDED]: { color: 'var(--color-danger)', soft: 'var(--color-danger-soft)', label: 'Suspended' },

  [TRIP_STATUS.DRAFT]: { color: 'var(--color-muted)', soft: 'var(--color-line)', label: 'Draft' },
  [TRIP_STATUS.DISPATCHED]: { color: 'var(--color-info)', soft: 'var(--color-info-soft)', label: 'Dispatched' },
  [TRIP_STATUS.COMPLETED]: { color: 'var(--color-success)', soft: 'var(--color-success-soft)', label: 'Completed' },
  [TRIP_STATUS.CANCELLED]: { color: 'var(--color-danger)', soft: 'var(--color-danger-soft)', label: 'Cancelled' },

  [MAINTENANCE_STATUS.OPEN]: { color: 'var(--color-warning)', soft: 'var(--color-warning-soft)', label: 'Open' },
  [MAINTENANCE_STATUS.IN_PROGRESS]: { color: 'var(--color-info)', soft: 'var(--color-info-soft)', label: 'In Progress' },
};

export const ROLES = {
  FLEET_MANAGER: 'FLEET_MANAGER',
  DISPATCHER: 'DISPATCHER',
  SAFETY_OFFICER: 'SAFETY_OFFICER',
  FINANCIAL_ANALYST: 'FINANCIAL_ANALYST',
};
