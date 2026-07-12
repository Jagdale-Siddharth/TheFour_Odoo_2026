import httpClient from './httpClient';
import { USE_MOCK, mockDelay } from './apiMode';
import { mockVehicles, mockDrivers, mockTrips, mockMaintenance, mockFuelLogs, mockExpenses } from '../mock/mockData';

export async function getVehicleSummaryReport() {
  if (USE_MOCK) return mockDelay(mockVehicles);
  return httpClient.get('/reports/vehicles');
}

export async function getTripSummaryReport() {
  if (USE_MOCK) {
    const enriched = mockTrips.map((t) => ({
      ...t,
      vehicleReg: mockVehicles.find((v) => v.id === t.vehicleId)?.registrationNumber,
      driverName: mockDrivers.find((d) => d.id === t.driverId)?.name,
    }));
    return mockDelay(enriched);
  }
  return httpClient.get('/reports/trips');
}

export async function getFuelSummaryReport() {
  if (USE_MOCK) return mockDelay(mockFuelLogs);
  return httpClient.get('/reports/fuel');
}

export async function getExpenseSummaryReport() {
  if (USE_MOCK) return mockDelay(mockExpenses);
  return httpClient.get('/reports/expenses');
}

export async function getMaintenanceSummaryReport() {
  if (USE_MOCK) return mockDelay(mockMaintenance);
  return httpClient.get('/reports/maintenance');
}
