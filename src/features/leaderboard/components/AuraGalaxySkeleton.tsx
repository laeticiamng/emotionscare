/**
 * AuraGalaxySkeleton - Skeleton de chargement pour la galaxie
 */
import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface AuraGalaxySkeletonProps {
  minHeight?: string;
}

export const AuraGalaxySkeleton = memo(function AuraGalaxySkeleton({
  minHeight = '400px',
}: AuraGalaxySkeletonProps) {
  return (
    <Card className="bg-gradient-to-br from-background via-secondary/10 to-primary/5 border-border overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* My aura skeleton */}
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>

        {/* Galaxy skeleton */}
        <div
          className="relative rounded-xl overflow-hidden bg-gradient-to-b from-background via-secondary/30 to-primary/20"
          style={{ minHeight }}
        >
          {/* Fake aura spheres */}
          <div className="absolute inset-0 p-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  width: 32 + (i % 3) * 16,
                  height: 32 + (i % 3) * 16,
                  left: `${10 + (i % 3) * 30}%`,
                  top: `${10 + Math.floor(i / 3) * 25}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Legend skeleton */}
        <div className="flex justify-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
});
