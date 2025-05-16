
import React from 'react';
import KpiCard from './KpiCard';
import { Users, Activity, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface KpiCardData {
  productivity: {
    current: number;
    trend: number;
  };
  emotionalScore: {
    current: number;
    trend: number;
  };
  gamification: {
    activeUsersPercent: number;
    totalBadges: number;
  };
}

interface KpiCardsGridProps {
  dashboardStats: KpiCardData;
}

const KpiCardsGrid: React.FC<KpiCardsGridProps> = ({ dashboardStats }) => {
  const navigate = useNavigate();
  
  // Define navigation handlers for drill-down
  const navigateToProductivity = () => navigate('/stats/productivity');
  const navigateToEmotionalScore = () => navigate('/stats/emotional-score');
  const navigateToEngagement = () => navigate('/stats/engagement');
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 col-span-1 md:col-span-2">
      {/* Productivity Card */}
      <KpiCard 
        id="productivity-card"
        title="Productivité"
        value={`${dashboardStats.productivity.current}%`}
        icon={<TrendingUp className="h-6 w-6" />}
        delta={{
          value: dashboardStats.productivity.trend,
          label: "vs période précédente",
          trend: dashboardStats.productivity.trend >= 0 ? 'up' : 'down'
        }}
        ariaLabel={`Productivité: ${dashboardStats.productivity.current}%`}
        onClick={navigateToProductivity}
      />
      
      {/* Emotional Score Card */}
      <KpiCard 
        id="emotional-score-card"
        title="Score émotionnel moyen"
        value={`${dashboardStats.emotionalScore.current}/100`}
        icon={<Activity className="h-6 w-6" />}
        delta={{
          value: dashboardStats.emotionalScore.trend,
          label: "vs période précédente",
          trend: dashboardStats.emotionalScore.trend >= 0 ? 'up' : 'down'
        }}
        ariaLabel={`Score émotionnel moyen: ${dashboardStats.emotionalScore.current}/100`}
        onClick={navigateToEmotionalScore}
      />
      
      {/* Engagement Gamification Card */}
      <KpiCard 
        id="engagement-card"
        title="Engagement gamification"
        value={`${dashboardStats.gamification.activeUsersPercent}%`}
        icon={<Users className="h-6 w-6" />}
        subtitle={`${dashboardStats.gamification.totalBadges} badges distribués ce mois`}
        ariaLabel={`Engagement gamification: ${dashboardStats.gamification.activeUsersPercent}%`}
        onClick={navigateToEngagement}
      />
    </div>
  );
};

export default KpiCardsGrid;
