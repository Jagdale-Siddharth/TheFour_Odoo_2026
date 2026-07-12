import { Truck, CheckCircle2, Wrench, Users, Route, CalendarClock, Fuel, HandCoins, Wallet } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { getDashboardSummary } from '../services/api/dashboard.service';
import KpiCard from '../components/dashboard/KpiCard';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import VehicleStatusChart from '../components/charts/VehicleStatusChart';
import TripStatusChart from '../components/charts/TripStatusChart';
import FuelCostTrendChart from '../components/charts/FuelCostTrendChart';
import MaintenanceCostChart from '../components/charts/MaintenanceCostChart';
import ExpenseDistributionChart from '../components/charts/ExpenseDistributionChart';
import FleetUtilizationGauge from '../components/charts/FleetUtilizationGauge';
import ErrorState from '../components/common/ErrorState';
import { formatCurrency, formatNumber, formatPercent } from '../utils/format';

export default function Dashboard() {
  const { data, loading, error, refetch } = useApi(getDashboardSummary, []);

  if (loading) return <DashboardSkeleton />;

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const { kpis, vehicleStatusBreakdown, tripStatusBreakdown, fuelCostTrend, maintenanceCostTrend, expenseDistribution } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-[var(--color-ink)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)]">Live snapshot of fleet operations.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Active Vehicles" value={formatNumber(kpis.activeVehicles)} icon={Truck} accent="var(--color-primary)" />
        <KpiCard label="Available Vehicles" value={formatNumber(kpis.availableVehicles)} icon={CheckCircle2} accent="var(--color-success)" />
        <KpiCard label="Vehicles In Shop" value={formatNumber(kpis.inShopVehicles)} icon={Wrench} accent="var(--color-warning)" />
        <KpiCard label="Drivers On Trip" value={formatNumber(kpis.driversOnTrip)} icon={Users} accent="var(--color-info)" />
        <KpiCard label="Active Trips" value={formatNumber(kpis.activeTrips)} icon={Route} accent="var(--color-info)" />
        <KpiCard label="Today's Trips" value={formatNumber(kpis.todaysTrips)} icon={CalendarClock} accent="var(--color-accent)" />
        <KpiCard label="Fuel Cost (MTD)" value={formatCurrency(kpis.fuelCost)} icon={Fuel} accent="var(--color-warning)" />
        <KpiCard label="Maintenance Cost" value={formatCurrency(kpis.maintenanceCost)} icon={Wrench} accent="var(--color-danger)" />
        <KpiCard label="Operational Cost" value={formatCurrency(kpis.operationalCost)} icon={Wallet} accent="var(--color-primary)" />
        <KpiCard label="Fleet Utilization" value={formatPercent(kpis.fleetUtilization)} icon={HandCoins} accent="var(--color-success)" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <VehicleStatusChart data={vehicleStatusBreakdown} />
        <TripStatusChart data={tripStatusBreakdown} />
        <FleetUtilizationGauge value={kpis.fleetUtilization} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FuelCostTrendChart data={fuelCostTrend} />
        <MaintenanceCostChart data={maintenanceCostTrend} />
        <ExpenseDistributionChart data={expenseDistribution} />
      </div>
    </div>
  );
}
