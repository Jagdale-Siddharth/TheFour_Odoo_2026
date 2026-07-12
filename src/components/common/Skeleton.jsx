export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-[var(--color-surface-sunken)] ${className}`} />;
}

// Mimics the shape of a real table while data loads, instead of a blank
// spinner — the brief calls for skeleton loaders specifically.
export function TableSkeleton({ columns = 4, rows = 6 }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-line)]">
      <div className="flex gap-4 bg-[var(--color-canvas)] px-4 py-2.5">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-[var(--color-line)]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 px-4 py-3">
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton key={c} className="h-3.5 flex-1" style={{ animationDelay: `${r * 40}ms` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}