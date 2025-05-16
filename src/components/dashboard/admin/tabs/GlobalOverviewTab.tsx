
import React from 'react';
import { DraggableKpiCardsGridProps } from '../draggable/types';
import DraggableKpiCardsGrid from '../draggable/DraggableKpiCardsGrid';
import TeamEmotionCard from '../cards/TeamEmotionCard';
import ActivityChart from '../charts/ActivityChart';
import EmotionTrendChart from '../charts/EmotionTrendChart';
import TeamLeaderboardCard from '../cards/TeamLeaderboardCard';

interface GlobalOverviewTabProps {
  kpiCards: DraggableKpiCardsGridProps['kpiCards'];
}

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ kpiCards }) => {
  return (
    <div className="space-y-6">
      <DraggableKpiCardsGrid kpiCards={kpiCards} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActivityChart />
          <EmotionTrendChart />
        </div>
        <div className="space-y-6">
          <TeamEmotionCard />
          <TeamLeaderboardCard />
        </div>
      </div>
    </div>
  );
};

export default GlobalOverviewTab;
