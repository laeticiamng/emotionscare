
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Medal, Trophy, Calendar, Target } from 'lucide-react';
import BadgeGrid from './BadgeGrid';
import ChallengesList from './ChallengesList';
import { useGamification } from '@/hooks/useGamification';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { GamificationStats, Challenge, Badge } from '@/types';

const GamificationDashboard: React.FC = () => {
  const { 
    badges, 
    challenges, 
    stats, 
    completeChallenge,
    isLoading
  } = useGamification();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Ensure stats has all required properties with default values
  const safeStats: GamificationStats = {
    level: stats?.level || 1,
    points: stats?.points || 0,
    badges: Array.isArray(stats?.badges) ? stats.badges : [],
    streak: stats?.streak || 0,
    completedChallenges: stats?.completedChallenges || 0,
    totalChallenges: stats?.totalChallenges || 0,
    // Additional properties
    nextLevel: stats?.nextLevel || 2,
    pointsToNextLevel: stats?.pointsToNextLevel || 100,
    nextLevelPoints: stats?.nextLevelPoints || 100,
    challenges: stats?.challenges || [],
    totalPoints: stats?.totalPoints || 0,
    currentLevel: stats?.currentLevel || 1,
    progressToNextLevel: stats?.progressToNextLevel || 0,
    streakDays: stats?.streakDays || 0,
    lastActivityDate: stats?.lastActivityDate || new Date().toISOString(),
    activeChallenges: stats?.activeChallenges || 0,
    badgesCount: stats?.badgesCount || 0,
    rank: stats?.rank || 'Beginner',
    recentAchievements: stats?.recentAchievements || [],
    leaderboard: stats?.leaderboard || []
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Niveau actuel
            </CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeStats.currentLevel}</div>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-muted-foreground">
                {safeStats.pointsToNextLevel} points jusqu'au niveau suivant
              </p>
              <Progress value={safeStats.progressToNextLevel} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Points totaux
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeStats.totalPoints}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {safeStats.badgesCount} badges débloqués
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Série de jours
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeStats.streakDays} jours</div>
            <p className="text-xs text-muted-foreground mt-2">
              Dernière activité: {safeStats.lastActivityDate ? new Date(safeStats.lastActivityDate).toLocaleDateString() : 'Jamais'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Défis actifs
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeStats.activeChallenges}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {safeStats.completedChallenges} défis complétés au total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="badges" className="space-y-4">
        <TabsList>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="challenges">Défis</TabsTrigger>
        </TabsList>
        <TabsContent value="badges" className="space-y-4">
          <BadgeGrid badges={badges} />
        </TabsContent>
        <TabsContent value="challenges" className="space-y-4">
          <div className="challenges-list">
            <ChallengesList 
              challenges={challenges} 
              onComplete={completeChallenge}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;
