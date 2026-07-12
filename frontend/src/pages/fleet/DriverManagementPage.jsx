import { useState } from "react";
import useDrivers from "../../hooks/useDrivers";
import DriverTable from "../../components/fleet/drivers/DriverTable";
import DriverFormModal from "../../components/fleet/drivers/DriverFormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import SearchBar from "../../components/common/SearchBar";
import { DriverStatus } from "../../constants/status";
import { primaryBtnClass } from "../../constants/styles";

export default function DriverManagementPage() {
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
    createDriver,
    updateDriver,
    deleteDriver,
  } = useDrivers();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (driver) => {
    setEditing(driver);
    setFormOpen(true);
  };

  const handleSubmit = (values) =>
    editing ? updateDriver(editing.id, values) : createDriver(values);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteDriver(deleteTarget.id);
    setDeleteTarget(null);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Driver Management</h1>
        <button onClick={openCreate} className={primaryBtnClass}>
          + Add Driver
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or license" />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {Object.values(DriverStatus).map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <DriverTable
        drivers={items}
        loading={loading}
        onEdit={openEdit}
        onDelete={(driver) => setDeleteTarget(driver)}
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

      <DriverFormModal
        open={formOpen}
        initialData={editing}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Driver"
        message={`Delete ${deleteTarget?.name}? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
