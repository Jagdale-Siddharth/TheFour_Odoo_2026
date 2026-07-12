import StatusBadge from "../../common/StatusBadge";

function isExpired(dateStr) {
  return new Date(dateStr).getTime() < Date.now();
}

export default function DriverTable({ drivers, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!drivers.length) {
    return <p className="p-6 text-center text-sm text-gray-500">No drivers found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">License</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Expiry</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Phone</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Safety Score</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {drivers.map((d) => {
            const expired = isExpired(d.licenseExpiryDate);
            return (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{d.name}</td>
                <td className="px-4 py-3 text-gray-700">
                  {d.licenseNumber} <span className="text-gray-400">({d.licenseCategory})</span>
                </td>
                <td className={`px-4 py-3 ${expired ? "font-semibold text-red-600" : "text-gray-700"}`}>
                  {new Date(d.licenseExpiryDate).toLocaleDateString()}
                  {expired && " (Expired)"}
                </td>
                <td className="px-4 py-3 text-gray-700">{d.contactNumber}</td>
                <td className="px-4 py-3 text-gray-700">{d.safetyScore}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={d.status} />
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => onEdit(d)} className="text-slate-600 hover:text-slate-900">
                    Edit
                  </button>
                  <button
                    disabled={d.status === "ON_TRIP"}
                    onClick={() => onDelete(d)}
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
