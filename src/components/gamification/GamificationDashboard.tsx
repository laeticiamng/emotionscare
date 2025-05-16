import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/types/gamification';
import { BadgesWidget } from '@/components/dashboard/widgets/BadgesWidget';
import { ChallengesList } from '@/components/gamification/ChallengesList';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface GamificationDashboardProps {
  stats: any;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ stats }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Add default values for properties that might not exist
  const userStats = {
    streak: stats?.streak || 0,
    completedChallenges: stats?.completedChallenges || 0,
    totalChallenges: stats?.totalChallenges || stats?.challenges?.length || 0,
    badges: stats?.badges || [],
    progress: stats?.progress || 0,
    leaderboard: stats?.leaderboard || [],
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Bienvenue dans l'arène {user?.name}!
          </CardTitle>
          <CardDescription>
            Suivez vos progrès et relevez de nouveaux défis pour améliorer votre bien-être émotionnel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Niveau actuel</h3>
              <span className="text-sm text-muted-foreground">
                Niveau {stats.level} {stats.nextLevel ? `→ ${stats.nextLevel}` : ''}
              </span>
              <Progress value={stats.progress || 0} className="h-2" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Série actuelle</h3>
              <div className="text-xl font-bold">{userStats.streak} jours</div>
              <span className="text-sm text-muted-foreground">Continuez pour maintenir votre lancée!</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Défis</CardTitle>
            <CardDescription>
              Relevez des défis pour gagner des points et des badges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Progression</h4>
              <span className="text-sm text-muted-foreground">
                {stats.challenges.filter(challenge => challenge.status === "completed" || challenge.completed).length} / {stats.challenges.length}
              </span>
            </div>
            <ChallengesList challenges={stats.challenges} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>
              Collectionnez des badges en atteignant des objectifs spécifiques.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Badges débloqués</h4>
              <span className="text-3xl font-bold">{userStats.completedChallenges}</span>
            </div>
            <BadgesWidget 
              badges={stats.badges}
              showSeeAll={stats.badges.length > 3}
              onSeeAll={() => navigate('/gamification')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamificationDashboard;
