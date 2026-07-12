import StatusBadge from "../../common/StatusBadge";
import { MaintenanceStatus } from "../../../constants/status";

export default function MaintenanceTable({ records, loading, onComplete, onDelete }) {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!records.length) {
    return <p className="p-6 text-center text-sm text-gray-500">No maintenance records found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Vehicle</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Started</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Est. Cost</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {records.map((m) => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">
                {m.vehicle?.registrationNumber}
              </td>
              <td className="px-4 py-3 text-gray-700">{m.maintenanceType}</td>
              <td className="px-4 py-3 text-gray-700">
                {new Date(m.startDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-gray-700">{m.estimatedCost ?? "-"}</td>
              <td className="px-4 py-3">
                <StatusBadge status={m.status} />
              </td>
              <td className="px-4 py-3 text-right space-x-3">
                {m.status !== MaintenanceStatus.COMPLETED && (
                  <button
                    onClick={() => onComplete(m)}
                    className="text-green-700 hover:text-green-900"
                  >
                    Complete
                  </button>
                )}
                <button
                  disabled={m.status !== MaintenanceStatus.COMPLETED}
                  onClick={() => onDelete(m)}
                  className="text-red-600 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
