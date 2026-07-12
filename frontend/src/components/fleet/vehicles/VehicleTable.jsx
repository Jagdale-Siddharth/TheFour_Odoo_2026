import StatusBadge from "../../common/StatusBadge";
import { VehicleStatus } from "../../../constants/status";

export default function VehicleTable({ vehicles, loading, onEdit, onRetire, onDelete }) {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!vehicles.length) {
    return <p className="p-6 text-center text-sm text-gray-500">No vehicles found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Registration</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Capacity</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {vehicles.map((v) => {
            const retired = v.status === VehicleStatus.RETIRED;
            const inShop = v.status === VehicleStatus.IN_SHOP;
            return (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{v.registrationNumber}</td>
                <td className="px-4 py-3 text-gray-700">{v.vehicleName}</td>
                <td className="px-4 py-3 text-gray-700">{v.vehicleType}</td>
                <td className="px-4 py-3 text-gray-700">{v.maxLoadCapacity}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={v.status} />
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button
                    disabled={retired}
                    onClick={() => onEdit(v)}
                    className="text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Edit
                  </button>
                  {!retired && (
                    <button
                      onClick={() => onRetire(v)}
                      className="text-amber-600 hover:text-amber-800"
                    >
                      Retire
                    </button>
                  )}
                  <button
                    disabled={inShop}
                    onClick={() => onDelete(v)}
                    className="text-red-600 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
