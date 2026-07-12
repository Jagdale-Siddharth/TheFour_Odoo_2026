import httpClient from './httpClient';
import { USE_MOCK, mockDelay } from './apiMode';
import { mockVehicles, mockDrivers, mockTrips, mockMaintenance, mockFuelLogs, mockExpenses } from '../mock/mockData';
import { VEHICLE_STATUS, DRIVER_STATUS, TRIP_STATUS } from '../../constants/status';

function computeMockSummary() {
  const activeVehicles = mockVehicles.filter((v) => v.status !== VEHICLE_STATUS.RETIRED).length;
  const availableVehicles = mockVehicles.filter((v) => v.status === VEHICLE_STATUS.AVAILABLE).length;
  const inShopVehicles = mockVehicles.filter((v) => v.status === VEHICLE_STATUS.IN_SHOP).length;
  const driversOnTrip = mockDrivers.filter((d) => d.status === DRIVER_STATUS.ON_TRIP).length;
  const activeTrips = mockTrips.filter((t) => t.status === TRIP_STATUS.DISPATCHED).length;
  const today = new Date().toISOString().slice(0, 10);
  const todaysTrips = mockTrips.filter((t) => t.dispatchedAt?.slice(0, 10) === '2026-07-12').length;
  const utilization = Math.round((mockVehicles.filter((v) => v.status === VEHICLE_STATUS.ON_TRIP).length / activeVehicles) * 100);
  const fuelCost = mockFuelLogs.reduce((sum, f) => sum + f.cost, 0);
  const maintenanceCost = mockMaintenance.reduce((sum, m) => sum + m.cost, 0);
  const operationalCost = mockExpenses.reduce((sum, e) => sum + e.amount, 0);

  return {
    kpis: {
      activeVehicles,
      availableVehicles,
      inShopVehicles,
      driversOnTrip,
      activeTrips,
      todaysTrips,
      fleetUtilization: utilization,
      fuelCost,
      maintenanceCost,
      operationalCost,
    },
    vehicleStatusBreakdown: countBy(mockVehicles, 'status'),
    tripStatusBreakdown: countBy(mockTrips, 'status'),
    fuelCostTrend: aggregateByMonth(mockExpenses.filter((e) => e.category === 'Fuel')),
    maintenanceCostTrend: aggregateByMonth(mockExpenses.filter((e) => e.category === 'Maintenance')),
    expenseDistribution: countAmountBy(mockExpenses, 'category'),
  };
}

function countBy(list, key) {
  const counts = {};
  list.forEach((item) => {
    counts[item[key]] = (counts[item[key]] || 0) + 1;
  });
  return Object.entries(counts).map(([status, count]) => ({ status, count }));
}

function countAmountBy(list, key) {
  const totals = {};
  list.forEach((item) => {
    totals[item[key]] = (totals[item[key]] || 0) + item.amount;
  });
  return Object.entries(totals).map(([name, value]) => ({ name, value }));
}

function aggregateByMonth(list) {
  return list.map((item) => ({ month: item.month, amount: item.amount }));
}

export async function getDashboardSummary() {
  if (USE_MOCK) return mockDelay(computeMockSummary());
  // Real endpoint — backend contract: GET /dashboard/summary
  return httpClient.get('/dashboard/summary');
}
