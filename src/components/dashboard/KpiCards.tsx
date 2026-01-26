// @ts-nocheck

import React from 'react';
import { Brain, CalendarDays, Trophy } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import KpiCard from './admin/KpiCard';
import { useNavigate } from 'react-router-dom';

interface KpiCardsProps {
  vrSessionsThisMonth: number;
  vrSessionsLastMonth: number;
  userBadgesCount: number;
  avgEmotionalScore?: number;
  isLoading?: boolean;
}

const KpiCards: React.FC<KpiCardsProps> = ({ 
  vrSessionsThisMonth, 
  vrSessionsLastMonth, 
  userBadgesCount,
  avgEmotionalScore = 0,
  isLoading = false
}) => {
  // Calculate delta percentage between this month and last month
  const sessionsDelta = vrSessionsLastMonth ? 
    Math.round(((vrSessionsThisMonth - vrSessionsLastMonth) / vrSessionsLastMonth) * 100) : 0;
  
  const navigate = useNavigate();
  
  // Define drill-down routes for each KPI
  const navigateToEmotionDetails = () => navigate('/app/journal');
  const navigateToVRSessions = () => navigate('/app/breath');
  const navigateToBadges = () => navigate('/gamification');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {isLoading ? (
        // Loading skeletons
        <>
          <Card className="p-4"><Skeleton className="h-24 w-full" /></Card>
          <Card className="p-4"><Skeleton className="h-24 w-full" /></Card>
          <Card className="p-4"><Skeleton className="h-24 w-full" /></Card>
        </>
      ) : (
        // Actual content using our KpiCard component
        <>
          <KpiCard
            id="emotion-score-card"
            title="Score émotionnel moyen"
            value={avgEmotionalScore}
            icon={<Brain className="h-6 w-6" />}
            subtitle="Score émotionnel moyen sur la période"
            ariaLabel={`Score émotionnel moyen: ${avgEmotionalScore}/100`}
            onClick={navigateToEmotionDetails}
          />
          
          <KpiCard
            id="vr-sessions-card"
            title="Sessions VR ce mois"
            value={vrSessionsThisMonth}
            icon={<CalendarDays className="h-6 w-6" />}
            delta={{
              value: sessionsDelta,
              trend: sessionsDelta >= 0 ? 'up' : 'down',
              direction: sessionsDelta >= 0 ? 'up' : 'down',
              label: "depuis le mois dernier"
            }}
            ariaLabel={`Sessions VR ce mois: ${vrSessionsThisMonth}`}
            onClick={navigateToVRSessions}
          />
          
          <KpiCard
            id="badges-card"
            title="Badges gagnés"
            value={userBadgesCount}
            icon={<Trophy className="h-6 w-6" />}
            subtitle="Félicitations!"
            ariaLabel={`Badges gagnés: ${userBadgesCount}`}
            onClick={navigateToBadges}
          />
        </>
      )}
    </div>
  );
};

export default KpiCards;
