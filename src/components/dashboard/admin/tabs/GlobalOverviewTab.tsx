
import React from 'react';
import { DashboardStats, GamificationData, KpiCardProps, GlobalOverviewTabProps } from '@/types';
import DraggableKpiCardsGrid from '@/components/dashboard/admin/draggable/DraggableKpiCardsGrid';

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ 
  kpiCards,
  absenteeismChartData,
  emotionalScoreTrend,
  dashboardStats,
  gamificationData,
  isLoading = false
}) => {
  return (
    <div className="space-y-6">
      <DraggableKpiCardsGrid kpiCards={kpiCards} />
      
      {/* Autres visualisations du tableau de bord pourraient être ajoutées ici */}
    </div>
  );
};

export default GlobalOverviewTab;
