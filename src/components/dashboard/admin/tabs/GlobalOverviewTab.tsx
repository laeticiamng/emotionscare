
import React from 'react';
import AbsenteeismCard from './overview/AbsenteeismCard';
import EmotionalClimateCard from '../EmotionalClimateCard';
import GdprDisclaimer from './overview/GdprDisclaimer';
import KpiCardsGrid from '../KpiCardsGrid';
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
      {/* Absenteeism Chart */}
      <AbsenteeismCard data={absenteeismChartData} />
      
      {/* Emotional Climate Card */}
      <EmotionalClimateCard emotionalScoreTrend={emotionalScoreTrend} />
      
      {/* KPI Summary Cards - Replaced with our new unified component */}
      <KpiCardsGrid 
        dashboardStats={dashboardStats}
        gamificationData={gamificationData}
      />
      
      {/* GDPR Disclaimer */}
      <GdprDisclaimer />
    </div>
  );
};

export default GlobalOverviewTab;
