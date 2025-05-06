
import React from 'react';
import { Brain, CalendarDays, Trophy } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from 'react-countup';
import KpiCard from './admin/KpiCard';

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
            value={<CountUp end={avgEmotionalScore} duration={2} decimals={1} suffix="/100" enableScrollSpy scrollSpyOnce />}
            icon={Brain}
            subtitle={
              <Progress value={avgEmotionalScore} className="h-2 bg-gray-100 mt-2" />
            }
            ariaLabel={`Score émotionnel moyen: ${avgEmotionalScore}/100`}
          />
          
          <KpiCard
            title="Sessions VR ce mois"
            value={<CountUp end={vrSessionsThisMonth} duration={2} enableScrollSpy scrollSpyOnce />}
            icon={CalendarDays}
            delta={{
              value: sessionsDelta,
              label: "depuis le mois dernier",
              trend: sessionsDelta >= 0 ? 'up' : 'down'
            }}
            ariaLabel={`Sessions VR ce mois: ${vrSessionsThisMonth}`}
          />
          
          <KpiCard
            title="Badges gagnés"
            value={<CountUp end={userBadgesCount} duration={2} enableScrollSpy scrollSpyOnce />}
            icon={Trophy}
            subtitle="Félicitations!"
            ariaLabel={`Badges gagnés: ${userBadgesCount}`}
          />
        </>
      )}
    </div>
  );
};

export default KpiCards;
