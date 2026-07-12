import { useState } from "react";
import useVehicles from "../../hooks/useVehicles";
import VehicleTable from "../../components/fleet/vehicles/VehicleTable";
import VehicleFormModal from "../../components/fleet/vehicles/VehicleFormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import SearchBar from "../../components/common/SearchBar";
import { VehicleStatus } from "../../constants/status";
import { primaryBtnClass } from "../../constants/styles";

export default function VehicleRegistryPage() {
  const {
    items,
    total,
    loading,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    pageSize,
    createVehicle,
    updateVehicle,
    retireVehicle,
    deleteVehicle,
  } = useVehicles();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null); // { type: "retire"|"delete", vehicle }

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (vehicle) => {
    setEditing(vehicle);
    setFormOpen(true);
  };

  const handleSubmit = (values) =>
    editing ? updateVehicle(editing.id, values) : createVehicle(values);

  const confirmAction = async () => {
    if (!confirmTarget) return;
    if (confirmTarget.type === "retire") await retireVehicle(confirmTarget.vehicle.id);
    if (confirmTarget.type === "delete") await deleteVehicle(confirmTarget.vehicle.id);
    setConfirmTarget(null);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Vehicle Registry</h1>
        <button onClick={openCreate} className={primaryBtnClass}>
          + Add Vehicle
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or registration" />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {Object.values(VehicleStatus).map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <VehicleTable
        vehicles={items}
        loading={loading}
        onEdit={openEdit}
        onRetire={(vehicle) => setConfirmTarget({ type: "retire", vehicle })}
        onDelete={(vehicle) => setConfirmTarget({ type: "delete", vehicle })}
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

      <VehicleFormModal
        open={formOpen}
        initialData={editing}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={!!confirmTarget}
        title={confirmTarget?.type === "retire" ? "Retire Vehicle" : "Delete Vehicle"}
        message={
          confirmTarget?.type === "retire"
            ? `Retire ${confirmTarget?.vehicle?.registrationNumber}? It will no longer be dispatchable.`
            : `Delete ${confirmTarget?.vehicle?.registrationNumber}? This cannot be undone.`
        }
        onConfirm={confirmAction}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
