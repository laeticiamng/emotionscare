
import React from 'react';
import { Brain, CalendarDays, Trophy } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from 'react-countup';
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
  const navigateToEmotionDetails = () => navigate('/journal');
  const navigateToVRSessions = () => navigate('/vr-sessions');
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
        // Actual content using our new KpiCard component
        <>
          <KpiCard
            title="Score émotionnel moyen"
            value={avgEmotionalScore}
            icon={<Brain className="h-6 w-6" />}
            subtitle={
              <Progress value={avgEmotionalScore} className="h-2 bg-gray-100 mt-2" />
            }
            ariaLabel={`Score émotionnel moyen: ${avgEmotionalScore}/100`}
            onClick={navigateToEmotionDetails}
          />
          
          <KpiCard
            title="Sessions VR ce mois"
            value={vrSessionsThisMonth}
            icon={<CalendarDays className="h-6 w-6" />}
            delta={{
              value: sessionsDelta,
              label: "depuis le mois dernier",
              trend: sessionsDelta >= 0 ? 'up' : 'down'
            }}
            ariaLabel={`Sessions VR ce mois: ${vrSessionsThisMonth}`}
            onClick={navigateToVRSessions}
          />
          
          <KpiCard
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
