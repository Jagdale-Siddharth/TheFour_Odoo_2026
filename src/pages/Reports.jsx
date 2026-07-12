import ReportSection from '../components/reports/ReportSection';
import StatusBadge from '../components/common/StatusBadge';
import {
  getVehicleSummaryReport,
  getTripSummaryReport,
  getFuelSummaryReport,
  getExpenseSummaryReport,
  getMaintenanceSummaryReport,
} from '../services/api/reports.service';
import { formatCurrency } from '../utils/format';
import { VEHICLE_STATUS, TRIP_STATUS, MAINTENANCE_STATUS, STATUS_COLOR_MAP } from '../constants/status';

const asOptions = (statusEnum) =>
  Object.values(statusEnum).map((value) => ({ value, label: STATUS_COLOR_MAP[value]?.label || value }));

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-[var(--color-ink)]">Reports</h1>
        <p className="text-sm text-[var(--color-muted)]">Search, filter, and export operational summaries.</p>
      </div>

      <ReportSection
        title="Vehicle Summary"
        fetcher={getVehicleSummaryReport}
        searchKeys={['registrationNumber', 'model']}
        filename="vehicle-summary.csv"
        statusKey="status"
        statusOptions={asOptions(VEHICLE_STATUS)}
        columns={[
          { key: 'registrationNumber', header: 'Registration' },
          { key: 'model', header: 'Model' },
          { key: 'capacityKg', header: 'Capacity (kg)' },
          { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />

      <ReportSection
        title="Trip Summary"
        fetcher={getTripSummaryReport}
        searchKeys={['vehicleReg', 'driverName', 'origin', 'destination']}
        filename="trip-summary.csv"
        statusKey="status"
        statusOptions={asOptions(TRIP_STATUS)}
        columns={[
          { key: 'vehicleReg', header: 'Vehicle' },
          { key: 'driverName', header: 'Driver' },
          { key: 'origin', header: 'Origin' },
          { key: 'destination', header: 'Destination' },
          { key: 'cargoWeightKg', header: 'Cargo (kg)' },
          { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />

      <ReportSection
        title="Fuel Summary"
        fetcher={getFuelSummaryReport}
        searchKeys={['loggedAt']}
        filename="fuel-summary.csv"
        columns={[
          { key: 'vehicleId', header: 'Vehicle ID' },
          { key: 'liters', header: 'Liters' },
          { key: 'cost', header: 'Cost', render: (r) => formatCurrency(r.cost) },
          { key: 'loggedAt', header: 'Date' },
        ]}
      />

      <ReportSection
        title="Expense Summary"
        fetcher={getExpenseSummaryReport}
        searchKeys={['category', 'month']}
        filename="expense-summary.csv"
        columns={[
          { key: 'category', header: 'Category' },
          { key: 'month', header: 'Month' },
          { key: 'amount', header: 'Amount', render: (r) => formatCurrency(r.amount) },
        ]}
      />

      <ReportSection
        title="Maintenance Summary"
        fetcher={getMaintenanceSummaryReport}
        searchKeys={['issue']}
        filename="maintenance-summary.csv"
        statusKey="status"
        statusOptions={asOptions(MAINTENANCE_STATUS)}
        columns={[
          { key: 'vehicleId', header: 'Vehicle ID' },
          { key: 'issue', header: 'Issue' },
          { key: 'cost', header: 'Cost', render: (r) => formatCurrency(r.cost) },
          { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          { key: 'openedAt', header: 'Opened' },
        ]}
      />
    </div>
  );
}