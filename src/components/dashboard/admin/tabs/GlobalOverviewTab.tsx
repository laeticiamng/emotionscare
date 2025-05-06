
import React from 'react';
import GdprDisclaimer from './overview/GdprDisclaimer';
import DraggableKpiCardsGrid from '../DraggableKpiCardsGrid';
import ChartSwitcher from '../../charts/ChartSwitcher';
import { ChartData, DashboardStats, GamificationData } from './overview/types';

interface GlobalOverviewTabProps {
  absenteeismChartData: ChartData[];
  emotionalScoreTrend: ChartData[];
  dashboardStats: DashboardStats;
  gamificationData: GamificationData;
}

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ 
  absenteeismChartData, 
  emotionalScoreTrend,
  dashboardStats,
  gamificationData
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Charts with switcher */}
      <ChartSwitcher
        title="Taux d'absentéisme"
        description="Évolution du taux d'absence"
        availableViews={["line", "area"]}
        defaultView="line"
        data={absenteeismChartData}
      />
      
      <ChartSwitcher
        title="Climate Émotionnel"
        description="Évolution du score émotionnel"
        availableViews={["line", "bar"]}
        defaultView="line"
        data={emotionalScoreTrend}
      />
      
      {/* KPI Summary Cards - Now using DraggableKpiCardsGrid instead of regular KpiCardsGrid */}
      <DraggableKpiCardsGrid 
        dashboardStats={dashboardStats}
        gamificationData={gamificationData}
      />
      
      {/* GDPR Disclaimer */}
      <GdprDisclaimer />
    </div>
  );
};

export default GlobalOverviewTab;
