
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useGamificationStats } from '@/hooks/community-gamification/useGamificationStats';

const B2BUserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats, loading } = useGamificationStats(user?.id);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">Tableau de bord entreprise</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Bien-être</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Score de bien-être: 85/100</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Challenges actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Vous avez {stats?.activeChallenges || 0} challenges en cours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Événements à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <p>2 événements d'équipe cette semaine</p>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4">Ressources recommandées</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium">Méditation guidée pour la productivité</h4>
              <p className="text-sm text-muted-foreground">15 min - Audio</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium">Gestion du stress en période de charge</h4>
              <p className="text-sm text-muted-foreground">Article - 5 min</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BUserDashboard;
