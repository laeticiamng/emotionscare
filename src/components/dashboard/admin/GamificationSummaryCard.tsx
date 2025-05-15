
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Trophy, Users, Award, Zap } from 'lucide-react';
import { GamificationStats } from '@/types/gamification';

export interface GamificationSummaryCardProps {
  gamificationData: GamificationStats;
}

const GamificationSummaryCard: React.FC<GamificationSummaryCardProps> = ({ gamificationData }) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-primary" />
          Aperçu de la Gamification
        </CardTitle>
        <CardDescription>Statistiques globales de l'engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col p-4 rounded-lg bg-background/80 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Badges Débloqués</p>
                <h3 className="text-2xl font-bold">{gamificationData.totalBadges || 0}</h3>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col p-4 rounded-lg bg-background/80 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Utilisateurs Actifs</p>
                <h3 className="text-2xl font-bold">{gamificationData.activeUsersPercent || 0}%</h3>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col p-4 rounded-lg bg-background/80 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Défis Complétés</p>
                <h3 className="text-2xl font-bold">{gamificationData.completedChallenges || 0}</h3>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col p-4 rounded-lg bg-background/80 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taux de Complétion</p>
                <h3 className="text-2xl font-bold">{gamificationData.completionRate || 0}%</h3>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationSummaryCard;
