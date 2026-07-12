export const VehicleStatus = {
  AVAILABLE: "AVAILABLE",
  ON_TRIP: "ON_TRIP",
  IN_SHOP: "IN_SHOP",
  RETIRED: "RETIRED",
};

export const DriverStatus = {
  AVAILABLE: "AVAILABLE",
  ON_TRIP: "ON_TRIP",
  OFF_DUTY: "OFF_DUTY",
  SUSPENDED: "SUSPENDED",
};

export const MaintenanceStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

export const STATUS_COLORS = {
  AVAILABLE: "bg-green-100 text-green-800",
  ON_TRIP: "bg-blue-100 text-blue-800",
  IN_SHOP: "bg-amber-100 text-amber-800",
  RETIRED: "bg-gray-200 text-gray-600",
  OFF_DUTY: "bg-gray-100 text-gray-600",
  SUSPENDED: "bg-red-100 text-red-800",
  OPEN: "bg-amber-100 text-amber-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
};
