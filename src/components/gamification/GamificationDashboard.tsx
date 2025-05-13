
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Medal, Trophy, Calendar, Target } from 'lucide-react';
import BadgeGrid from './BadgeGrid';
import ChallengesList from './ChallengesList';
import { useGamification } from '@/hooks/useGamification';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

const GamificationDashboard: React.FC = () => {
  const { 
    badges, 
    challenges, 
    stats, 
    loading: isLoading, 
    completeChallenge: loadGamificationData 
  } = useGamification();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

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
            <div className="text-2xl font-bold">{stats.currentLevel}</div>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-muted-foreground">
                {stats.pointsToNextLevel} points jusqu'au niveau suivant
              </p>
              <Progress value={stats.progressToNextLevel} className="h-1" />
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
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.badgesCount} badges débloqués
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
            <div className="text-2xl font-bold">{stats.streakDays} jours</div>
            <p className="text-xs text-muted-foreground mt-2">
              Dernière activité: {stats.lastActivityDate ? new Date(stats.lastActivityDate).toLocaleDateString() : 'Jamais'}
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
            <div className="text-2xl font-bold">{stats.activeChallenges}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.completedChallenges} défis complétés au total
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
            {challenges.map(challenge => ({
              id: challenge.id,
              title: challenge.title || challenge.name,
              description: challenge.description,
              points: challenge.points,
              status: challenge.status || (challenge.completed ? 'completed' : 'ongoing'),
              category: challenge.category || 'general'
            }))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;
