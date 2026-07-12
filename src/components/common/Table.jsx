import { TableSkeleton } from './Skeleton';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

/**
 * Generic table. `columns`: [{ key, header, render?(row) }]
 * Every module (Vehicles, Drivers, Trips...) reuses this instead of
 * writing its own <table>.
 */
export default function Table({ columns, data, loading, error, onRetry, emptyTitle = 'No records found', rowKey = 'id' }) {
  if (loading) return <TableSkeleton columns={columns.length} />;

  if (error) return <ErrorState message={error} onRetry={onRetry} />;

  if (!data || data.length === 0) return <EmptyState title={emptyTitle} />;

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-line)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--color-canvas)] text-[var(--color-muted)]">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2.5 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-line)]">
          {data.map((row) => (
            <tr key={row[rowKey]} className="hover:bg-[var(--color-canvas)]">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2.5 text-[var(--color-ink)]">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}