import React from 'react';
import { useActivity } from '@/hooks/useActivity';
import { FiltersBar } from '@/components/activity/FiltersBar';
import { Timeline } from '@/components/activity/Timeline';
import { EmptyState } from '@/components/activity/EmptyState';
import { ExportButton } from '@/components/activity/ExportButton';

/**
 * Page d'historique d'activité avec timeline, filtres et export
 */
const ActivityPage: React.FC = () => {
  const { items, loading, filters, setFilters, refetch } = useActivity();

  return (
    <main 
      className="min-h-screen bg-background p-4 md:p-6"
      data-testid="page-root"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Historique d'activité
            </h1>
            <p className="text-muted-foreground">
              Retrouvez toutes vos sessions et succès
            </p>
          </div>
          <ExportButton />
        </div>

        {/* Filters */}
        <FiltersBar 
          filters={filters}
          onChange={setFilters}
        />

        {/* Content */}
        <div className="space-y-4">
          {items.length === 0 && !loading ? (
            <EmptyState onRetry={refetch} />
          ) : (
            <Timeline 
              items={items}
              loading={loading}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default ActivityPage;