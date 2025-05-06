
import React from 'react';
import KpiCard from './KpiCard';
import { Users, Activity, TrendingUp } from 'lucide-react';

interface KpiCardsGridProps {
  dashboardStats: {
    productivity: {
      current: number;
      trend: number;
    };
    emotionalScore: {
      current: number;
      trend: number;
    };
  };
  gamificationData: {
    activeUsersPercent: number;
    totalBadges: number;
  };
}

const KpiCardsGrid: React.FC<KpiCardsGridProps> = ({ dashboardStats, gamificationData }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 col-span-1 md:col-span-2">
      {/* Productivity Card */}
      <KpiCard 
        title="Productivité"
        value={`${dashboardStats.productivity.current}%`}
        icon={TrendingUp}
        delta={{
          value: dashboardStats.productivity.trend,
          label: "vs période précédente",
          trend: dashboardStats.productivity.trend >= 0 ? 'up' : 'down'
        }}
        ariaLabel={`Productivité: ${dashboardStats.productivity.current}%`}
      />
      
      {/* Emotional Score Card */}
      <KpiCard 
        title="Score émotionnel moyen"
        value={`${dashboardStats.emotionalScore.current}/100`}
        icon={Activity}
        delta={{
          value: dashboardStats.emotionalScore.trend,
          label: "vs période précédente",
          trend: dashboardStats.emotionalScore.trend >= 0 ? 'up' : 'down'
        }}
        ariaLabel={`Score émotionnel moyen: ${dashboardStats.emotionalScore.current}/100`}
      />
      
      {/* Engagement Gamification Card */}
      <KpiCard 
        title="Engagement gamification"
        value={`${gamificationData.activeUsersPercent}%`}
        icon={Users}
        subtitle={`${gamificationData.totalBadges} badges distribués ce mois`}
        ariaLabel={`Engagement gamification: ${gamificationData.activeUsersPercent}%`}
      />
    </div>
  );
};

export default KpiCardsGrid;
