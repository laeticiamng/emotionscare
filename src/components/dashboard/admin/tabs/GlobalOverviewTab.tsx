
import React from 'react';
import { DashboardStats, GamificationData, KpiCardProps } from '@/types';
import DraggableKpiCardsGrid from '@/components/dashboard/admin/DraggableKpiCardsGrid';

interface GlobalOverviewTabProps {
  kpiCards: KpiCardProps[];
}

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ kpiCards }) => {
  return (
    <div className="space-y-6">
      <DraggableKpiCardsGrid kpiCards={kpiCards} />
    </div>
  );
};

export default GlobalOverviewTab;
