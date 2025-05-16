import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GamificationStats } from '@/types/gamification';

interface GamificationSummaryCardProps {
  stats: Partial<GamificationStats>;
}

export const GamificationSummaryCard: React.FC<GamificationSummaryCardProps> = ({ stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé de la gamification</CardTitle>
        <CardDescription>Aperçu des statistiques clés</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-2xl font-medium">Badges</div>
          <div className="text-3xl font-bold">{stats.badges?.length || 0}</div>
          <div className="text-muted-foreground text-sm">Total de badges débloqués</div>
        </div>
        <div>
          <div className="text-2xl font-medium">Engagement</div>
          <div className="text-3xl font-bold">{stats.activeUsersPercent || 85}%</div>
          <div className="text-muted-foreground text-sm">Utilisateurs actifs</div>
        </div>
        <div>
          <div className="text-2xl font-medium">Complétion</div>
          <div className="text-3xl font-bold">{stats.completionRate || 72}%</div>
          <div className="text-muted-foreground text-sm">Taux de complétion des défis</div>
        </div>
      </CardContent>
    </Card>
  );
};
