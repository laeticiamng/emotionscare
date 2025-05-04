
import React from 'react';
import { Brain, CalendarDays, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from 'react-countup';

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="apple-card transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Brain size={18} className="mr-2 text-wellness-blue" />
            Score émotionnel moyen
          </CardTitle>
          <CardDescription>Tous les collaborateurs</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-2 w-full" />
            </>
          ) : (
            <>
              <div className="text-3xl font-bold mb-2">
                <CountUp 
                  end={avgEmotionalScore} 
                  duration={2} 
                  decimals={1} 
                  suffix="/100" 
                  enableScrollSpy 
                  scrollSpyOnce
                />
              </div>
              <Progress value={avgEmotionalScore} className="h-2 bg-gray-100" />
            </>
          )}
        </CardContent>
      </Card>

      <Card className="apple-card transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CalendarDays size={18} className="mr-2 text-wellness-blue" />
            Sessions VR ce mois
          </CardTitle>
          <CardDescription>Toute l'équipe</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-32" />
            </>
          ) : (
            <>
              <div className="text-3xl font-bold">
                <CountUp 
                  end={vrSessionsThisMonth} 
                  duration={2} 
                  enableScrollSpy 
                  scrollSpyOnce
                />
              </div>
              <div className="text-sm text-muted-foreground">
                +<CountUp 
                  end={vrSessionsThisMonth - vrSessionsLastMonth} 
                  duration={1.5}
                  enableScrollSpy 
                  scrollSpyOnce
                /> depuis le mois dernier
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="apple-card transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Trophy size={18} className="mr-2 text-wellness-blue" />
            Badges gagnés
          </CardTitle>
          <CardDescription>Vos accomplissements</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </>
          ) : (
            <>
              <div className="text-3xl font-bold">
                <CountUp 
                  end={userBadgesCount} 
                  duration={2}
                  enableScrollSpy 
                  scrollSpyOnce
                />
              </div>
              <div className="text-sm text-muted-foreground">Félicitations!</div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KpiCards;
