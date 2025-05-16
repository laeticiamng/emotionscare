
import React from 'react';
import { BarChart3, Trophy, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GamificationSummaryCard } from '@/components/dashboard/admin/GamificationSummaryCard';
import { GamificationStats } from '@/types/gamification';

interface GamificationTabProps {
  gamificationData: GamificationStats;
}

export const GamificationTab: React.FC<GamificationTabProps> = ({ gamificationData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges débloqués</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {gamificationData.unlockedBadges || gamificationData.badges?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 10) + 1} depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'engagement</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {gamificationData.activeUsersPercent || 67}%
            </div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 10) + 1}% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Défis complétés</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {gamificationData.completedChallenges || 234}
            </div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 20) + 10} depuis le mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <GamificationSummaryCard stats={gamificationData} />
      
      <Card>
        <CardHeader>
          <CardTitle>Analyse des tendances</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Cette section affichera des graphiques détaillés sur l'utilisation des fonctionnalités de gamification.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationTab;
