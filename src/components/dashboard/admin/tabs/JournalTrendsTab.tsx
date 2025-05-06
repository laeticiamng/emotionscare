
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface JournalTrendsTabProps {
  isLoading?: boolean;
}

const JournalTrendsTab: React.FC<JournalTrendsTabProps> = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-card p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <h3 className="text-xl font-semibold mb-4">Tendances journal à venir</h3>
        <p className="text-muted-foreground">
          Les tendances du journal sont en cours de développement...
        </p>
      </div>
    </div>
  );
};

export default JournalTrendsTab;
