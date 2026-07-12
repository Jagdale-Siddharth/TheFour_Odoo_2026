import { useState } from "react";
import useMaintenance from "../../hooks/useMaintenance";
import useVehicles from "../../hooks/useVehicles";
import MaintenanceTable from "../../components/fleet/maintenance/MaintenanceTable";
import MaintenanceFormModal from "../../components/fleet/maintenance/MaintenanceFormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { MaintenanceStatus } from "../../constants/status";
import { primaryBtnClass } from "../../constants/styles";

export default function MaintenancePage() {
  const {
    items,
    total,
    loading,
    status,
    setStatus,
    page,
    setPage,
    pageSize,
    createRecord,
    completeRecord,
    deleteRecord,
  } = useMaintenance();

  // Reuse the vehicle list (large page size) to populate the "eligible
  // vehicle" dropdown when starting new maintenance.
  const { items: vehicles } = useVehicles();

  const [formOpen, setFormOpen] = useState(false);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const confirmComplete = async () => {
    if (!completeTarget) return;
    await completeRecord(completeTarget.id, {});
    setCompleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteRecord(deleteTarget.id);
    setDeleteTarget(null);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Maintenance</h1>
        <button onClick={() => setFormOpen(true)} className={primaryBtnClass}>
          + New Maintenance Record
        </button>
      </div>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="">All statuses</option>
        {Object.values(MaintenanceStatus).map((s) => (
          <option key={s} value={s}>
            {s.replace("_", " ")}
          </option>
        ))}
      </select>

      <MaintenanceTable
        records={items}
        loading={loading}
        onComplete={(record) => setCompleteTarget(record)}
        onDelete={(record) => setDeleteTarget(record)}
      />

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded px-3 py-1 border border-gray-300 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-2 py-1 text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded px-3 py-1 border border-gray-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      <MaintenanceFormModal
        open={formOpen}
        vehicles={vehicles}
        onSubmit={createRecord}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={!!completeTarget}
        title="Complete Maintenance"
        message="Mark this maintenance record complete? The vehicle will become available again (unless it has been retired)."
        onConfirm={confirmComplete}
        onCancel={() => setCompleteTarget(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Maintenance Record"
        message="Delete this completed maintenance record? This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
