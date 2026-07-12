import { VEHICLE_STATUS, DRIVER_STATUS, TRIP_STATUS, MAINTENANCE_STATUS } from '../../constants/status';

export const mockVehicles = [
  { id: 1, registrationNumber: 'MH-04-AB-1234', model: 'Tata Ace', capacityKg: 750, status: VEHICLE_STATUS.ON_TRIP },
  { id: 2, registrationNumber: 'MH-12-CJ-5521', model: 'Ashok Leyland Dost', capacityKg: 1250, status: VEHICLE_STATUS.AVAILABLE },
  { id: 3, registrationNumber: 'MH-14-XT-8890', model: 'Mahindra Bolero Pickup', capacityKg: 1600, status: VEHICLE_STATUS.IN_SHOP },
  { id: 4, registrationNumber: 'MH-04-KL-0021', model: 'Eicher Pro 2049', capacityKg: 4900, status: VEHICLE_STATUS.AVAILABLE },
  { id: 5, registrationNumber: 'MH-01-QW-7743', model: 'Tata 407 Gold', capacityKg: 2500, status: VEHICLE_STATUS.RETIRED },
  { id: 6, registrationNumber: 'MH-04-ZP-3391', model: 'Ashok Leyland Dost+', capacityKg: 1500, status: VEHICLE_STATUS.ON_TRIP },
];

export const mockDrivers = [
  { id: 1, name: 'Ramesh Yadav', licenseNumber: 'MH04-2019-0041521', licenseExpiry: '2027-03-11', status: DRIVER_STATUS.ON_TRIP },
  { id: 2, name: 'Suresh Pawar', licenseNumber: 'MH12-2020-0091823', licenseExpiry: '2026-11-02', status: DRIVER_STATUS.AVAILABLE },
  { id: 3, name: 'Anil Kadam', licenseNumber: 'MH14-2018-0072210', licenseExpiry: '2026-01-30', status: DRIVER_STATUS.OFF_DUTY },
  { id: 4, name: 'Vikram Shinde', licenseNumber: 'MH04-2021-0102934', licenseExpiry: '2028-06-19', status: DRIVER_STATUS.SUSPENDED },
  { id: 5, name: 'Deepak More', licenseNumber: 'MH01-2017-0053312', licenseExpiry: '2026-08-15', status: DRIVER_STATUS.ON_TRIP },
];

export const mockTrips = [
  { id: 101, vehicleId: 1, driverId: 1, origin: 'Palghar', destination: 'Vasai', cargoWeightKg: 620, status: TRIP_STATUS.DISPATCHED, dispatchedAt: '2026-07-12T06:20:00Z' },
  { id: 102, vehicleId: 6, driverId: 5, origin: 'Bhiwandi', destination: 'Thane', cargoWeightKg: 1400, status: TRIP_STATUS.DISPATCHED, dispatchedAt: '2026-07-12T05:00:00Z' },
  { id: 103, vehicleId: 2, driverId: 2, origin: 'Nashik', destination: 'Pune', cargoWeightKg: 900, status: TRIP_STATUS.COMPLETED, dispatchedAt: '2026-07-11T04:10:00Z' },
  { id: 104, vehicleId: 4, driverId: 3, origin: 'Panvel', destination: 'Mumbai', cargoWeightKg: 3200, status: TRIP_STATUS.COMPLETED, dispatchedAt: '2026-07-10T09:45:00Z' },
  { id: 105, vehicleId: 3, driverId: 4, origin: 'Kalyan', destination: 'Dombivli', cargoWeightKg: 1100, status: TRIP_STATUS.CANCELLED, dispatchedAt: '2026-07-09T12:00:00Z' },
  { id: 106, vehicleId: 5, driverId: 2, origin: 'Aurangabad', destination: 'Jalna', cargoWeightKg: 1800, status: TRIP_STATUS.DRAFT, dispatchedAt: null },
];

export const mockMaintenance = [
  { id: 1, vehicleId: 3, issue: 'Brake pad replacement', cost: 4200, status: MAINTENANCE_STATUS.IN_PROGRESS, openedAt: '2026-07-08' },
  { id: 2, vehicleId: 5, issue: 'Engine overhaul', cost: 38500, status: MAINTENANCE_STATUS.COMPLETED, openedAt: '2026-06-20' },
  { id: 3, vehicleId: 2, issue: 'Tyre rotation', cost: 1600, status: MAINTENANCE_STATUS.COMPLETED, openedAt: '2026-06-28' },
];

export const mockFuelLogs = [
  { id: 1, vehicleId: 1, liters: 32, cost: 3050, loggedAt: '2026-07-11' },
  { id: 2, vehicleId: 2, liters: 40, cost: 3820, loggedAt: '2026-07-10' },
  { id: 3, vehicleId: 4, liters: 55, cost: 5240, loggedAt: '2026-07-09' },
  { id: 4, vehicleId: 6, liters: 28, cost: 2680, loggedAt: '2026-07-08' },
  { id: 5, vehicleId: 1, liters: 30, cost: 2860, loggedAt: '2026-07-05' },
];

export const mockExpenses = [
  { id: 1, category: 'Fuel', amount: 17650, month: 'Feb' },
  { id: 2, category: 'Fuel', amount: 19200, month: 'Mar' },
  { id: 3, category: 'Fuel', amount: 21100, month: 'Apr' },
  { id: 4, category: 'Fuel', amount: 20450, month: 'May' },
  { id: 5, category: 'Fuel', amount: 22870, month: 'Jun' },
  { id: 6, category: 'Fuel', amount: 24310, month: 'Jul' },
  { id: 7, category: 'Maintenance', amount: 8200, month: 'Feb' },
  { id: 8, category: 'Maintenance', amount: 5100, month: 'Mar' },
  { id: 9, category: 'Maintenance', amount: 12400, month: 'Apr' },
  { id: 10, category: 'Maintenance', amount: 6300, month: 'May' },
  { id: 11, category: 'Maintenance', amount: 9800, month: 'Jun' },
  { id: 12, category: 'Maintenance', amount: 44300, month: 'Jul' },
  { id: 13, category: 'Tolls & Permits', amount: 4100, month: 'Jul' },
  { id: 14, category: 'Driver Allowance', amount: 15600, month: 'Jul' },
];
