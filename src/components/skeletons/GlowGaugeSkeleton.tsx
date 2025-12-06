// @ts-nocheck
import React from 'react';

export const GlowGaugeSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg border animate-pulse">
      {/* Circular gauge skeleton */}
      <div className="relative">
        <div className="w-[220px] h-[220px] rounded-full border-[16px] border-muted bg-muted/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="h-6 w-16 bg-muted rounded" />
          </div>
        </div>
      </div>
      
      {/* Tip skeleton */}
      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md w-full max-w-sm">
        <div className="h-4 w-4 bg-muted rounded shrink-0" />
        <div className="h-4 bg-muted rounded flex-1" />
      </div>
    </div>
  );
};