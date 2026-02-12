import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { Button } from "@/components/ui/button";
import ActivityLogsList from "./ActivityLogsList";
import { useActivityData } from './useActivityData';
import { ActivityTabView } from './types';

const ActivityLogsTab: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ActivityTabView>("daily");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    activityType: 'all',
    startDate: '',
    endDate: ''
  });

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setFilters({
      ...filters,
      startDate: range.from ? range.from.toISOString() : '',
      endDate: range.to ? range.to.toISOString() : '',
    });
  };

  const {
    anonymousActivities,
    activityStats,
    isLoading,
    error,
    totalActivities,
    totalPages,
    fetchData
  } = useActivityData({
    activeTab,
    filters,
    currentPage,
    pageSize
  });

  const handleExportActivities = () => {
    logger.info('Exporting activities', { activeTab, filters }, 'ADMIN');
    toast({
      title: "Export en cours",
      description: "Le fichier d'export sera prêt dans quelques instants."
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Journal d'activité</h2>
          <p className="text-muted-foreground">
            Consultez l'activité anonymisée des utilisateurs de la plateforme
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" onClick={() => setActiveTab(activeTab === 'daily' ? 'stats' : 'daily')}>
            {activeTab === 'daily' ? 'Voir les statistiques' : 'Voir le journal'}
          </Button>
        </div>
      </div>

      <ActivityLogsList
        activeTab={activeTab}
        anonymousActivities={anonymousActivities}
        activityStats={activityStats}
        isLoading={isLoading}
        error={error}
        filters={filters}
        setFilters={setFilters}
        handleDateRangeChange={handleDateRangeChange}
        handleRefresh={fetchData}
        exportActivities={handleExportActivities}
      />

      {totalPages > 1 && activeTab === 'daily' && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Affichage de {(currentPage - 1) * pageSize + 1} à {Math.min(currentPage * pageSize, totalActivities)} sur {totalActivities} résultats
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogsTab;
