
import React from 'react';
import { Brain, CalendarDays, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockUsers } from '@/data/mockData';

interface KpiCardsProps {
  vrSessionsThisMonth: number;
  vrSessionsLastMonth: number;
  userBadgesCount: number;
}

const KpiCards: React.FC<KpiCardsProps> = ({ 
  vrSessionsThisMonth, 
  vrSessionsLastMonth, 
  userBadgesCount 
}) => {
  // Calculate average emotional score
  const avgEmotionalScore = mockUsers.reduce((sum, user) => sum + (user.emotional_score || 0), 0) / mockUsers.length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Brain size={18} className="mr-2 text-primary" />
            Score émotionnel moyen
          </CardTitle>
          <CardDescription>Tous les collaborateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">
            {avgEmotionalScore.toFixed(1)}/100
          </div>
          <Progress value={avgEmotionalScore} className="h-2" />
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CalendarDays size={18} className="mr-2 text-primary" />
            Sessions VR ce mois
          </CardTitle>
          <CardDescription>Toute l'équipe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{vrSessionsThisMonth}</div>
          <div className="text-sm text-muted-foreground">
            +{vrSessionsThisMonth - vrSessionsLastMonth} depuis le mois dernier
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Trophy size={18} className="mr-2 text-primary" />
            Badges gagnés
          </CardTitle>
          <CardDescription>Vos accomplissements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{userBadgesCount}</div>
          <div className="text-sm text-muted-foreground">Félicitations!</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KpiCards;
