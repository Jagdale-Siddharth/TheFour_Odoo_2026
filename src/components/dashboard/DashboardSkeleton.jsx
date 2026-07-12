import Card from '../common/Card';
import Skeleton from '../common/Skeleton';

// Mirrors the real Dashboard layout (10 KPI cards + 2 chart rows) so the
// page doesn't jump around once data arrives.
export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} className="flex items-center justify-between">
            <div className="w-full space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="mb-3 h-4 w-28" />
            <Skeleton className="h-[220px] w-full" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="mb-3 h-4 w-28" />
            <Skeleton className="h-[220px] w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}