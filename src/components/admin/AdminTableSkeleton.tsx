import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminTableSkeletonProps {
  columns?: number;
  rows?: number;
  showHeader?: boolean;
  showSearch?: boolean;
  showStats?: boolean;
}

const AdminTableSkeleton: React.FC<AdminTableSkeletonProps> = ({
  columns = 4,
  rows = 6,
  showHeader = true,
  showSearch = true,
  showStats = true,
}) => {
  return (
    <div className="space-y-6" role="status" aria-label="Chargement des données">
      {/* Header skeleton */}
      {showHeader && (
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      )}

      {/* Search bar skeleton */}
      {showSearch && (
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1 max-w-sm" />
          <Skeleton className="h-10 w-32" />
        </div>
      )}

      {/* Stats cards skeleton */}
      {showStats && (
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 space-y-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      )}

      {/* Table skeleton */}
      <div className="rounded-md border">
        {/* Table header */}
        <div className="border-b bg-muted/50 p-3">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>

        {/* Table rows */}
        <div className="divide-y">
          {[...Array(rows)].map((_, rowIdx) => (
            <div key={rowIdx} className="p-3">
              <div
                className="grid gap-4 items-center"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
              >
                {[...Array(columns)].map((_, colIdx) => (
                  <Skeleton
                    key={colIdx}
                    className={`h-4 ${colIdx === 0 ? 'w-3/4' : 'w-full'}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Chargement en cours...</span>
    </div>
  );
};

export default AdminTableSkeleton;
