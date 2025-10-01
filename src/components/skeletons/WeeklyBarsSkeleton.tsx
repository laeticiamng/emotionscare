// @ts-nocheck
import React from 'react';

export const WeeklyBarsSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-lg border p-6 animate-pulse">
      <div className="mb-4">
        <div className="h-6 w-24 bg-muted rounded" />
      </div>
      
      <div className="flex items-end justify-between gap-4 h-20" style={{ maxWidth: '280px' }}>
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div 
              className="w-6 bg-muted rounded-lg"
              style={{ 
                height: `${Math.random() * 40 + 20}px` // Random heights for variety
              }}
            />
            <div className="w-8 h-3 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};