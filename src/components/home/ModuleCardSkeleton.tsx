/**
 * ModuleCardSkeleton - Skeleton loading pour les cartes de modules
 * @version 1.0.0
 */

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ModuleCardSkeletonProps {
  className?: string;
}

const ModuleCardSkeleton: React.FC<ModuleCardSkeletonProps> = ({ className }) => {
  return (
    <div className={`h-full bg-muted/50 p-8 rounded-2xl shadow-sm animate-pulse ${className}`}>
      <div className="flex flex-col h-full">
        {/* Statistique placeholder */}
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        {/* Icône et titre */}
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <Skeleton className="h-7 w-32" />
        </div>
        
        {/* Description */}
        <div className="space-y-2 mb-8 flex-grow">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        
        {/* Bouton placeholder */}
        <Skeleton className="h-10 w-full rounded-lg mt-auto" />
      </div>
    </div>
  );
};

export default ModuleCardSkeleton;
