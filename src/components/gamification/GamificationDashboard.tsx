
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Trophy, Flame, Medal } from 'lucide-react';
import { useCommunityGamification } from '@/hooks/useCommunityGamification';
import { Progress } from '@/components/ui/progress';
import BadgeGrid from './BadgeGrid';
import ChallengeItem from './ChallengeItem';
import GamificationLevelProgress from '@/components/gamification/widgets/GamificationLevelProgress';
import GamificationStatsCards from '@/components/gamification/widgets/GamificationStatsCards';

const GamificationDashboard: React.FC = () => {
  const [loadingChallengeId, setLoadingChallengeId] = useState<string | null>(null);
  const { 
    stats, 
    activeChallenges,
    recommendedChallenges,
    completeChallenge,
    acceptChallenge, 
    isLoading,
    refresh
  } = useCommunityGamification();

  const handleCompleteChallenge = async (challengeId: string) => {
    setLoadingChallengeId(challengeId);
    try {
      await completeChallenge(challengeId);
    } finally {
      setLoadingChallengeId(null);
    }
  };

  const handleAcceptChallenge = async (challengeId: string) => {
    setLoadingChallengeId(challengeId);
    try {
      await acceptChallenge(challengeId);
    } finally {
      setLoadingChallengeId(null);
    }
  };

  // Calculate progress as a percentage of total points needed for a threshold
  const calculateProgress = (threshold: number) => {
    if (!stats) return 0;
    return Math.min(100, (stats.points / threshold) * 100);
  };

  if (isLoading || !stats) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <Card className="md:w-2/3 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-amber-500" />
              Votre Niveau
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Medal className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Niveau {stats.level}</h3>
                <p className="text-sm text-muted-foreground">{stats.points} points totaux</p>
              </div>
            </div>
            
            <GamificationLevelProgress 
              level={stats.level} 
              points={stats.points}
              nextMilestone={stats.nextLevelPoints} 
              progressToNextLevel={(stats.points / stats.nextLevelPoints) * 100}
            />
          </CardContent>
        </Card>
        
        <Card className="md:w-1/3 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Flame className="mr-2 h-5 w-5 text-orange-500" />
              Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.badges && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Badges débloqués</span>
                  <span className="text-2xl font-bold">{stats.badges.filter(b => b.unlocked).length}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Défis complétés</span>
                <span className="text-2xl font-bold">
                  {stats.challenges?.filter(c => c.completed).length || 0}
                </span>
              </div>
              
              <div>
                <span className="text-sm font-medium">Réalisations récentes</span>
                <div className="mt-1 space-y-2">
                  {stats.recentAchievements?.slice(0, 2).map(achievement => (
                    <div key={achievement.id} className="bg-muted/30 p-2 rounded-md text-xs">
                      {achievement.name} 
                      {achievement.points && (
                        <span className="text-primary float-right">+{achievement.points} pts</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="challenges" className="space-y-4">
        <TabsList>
          <TabsTrigger value="challenges">Défis</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="challenges">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Vos défis actifs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeChallenges.length > 0 ? activeChallenges.map(challenge => (
                  <ChallengeItem 
                    key={challenge.id}
                    id={challenge.id}
                    title={challenge.name || challenge.title}
                    description={challenge.description}
                    points={challenge.points || 50}
                    isCompleted={!!challenge.completed}
                    onComplete={handleCompleteChallenge}
                    isLoading={loadingChallengeId === challenge.id}
                  />
                )) : (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    Vous n'avez pas de défis actifs pour le moment
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Défis recommandés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedChallenges.map(challenge => (
                  <Card key={challenge.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{challenge.name || challenge.title}</h4>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {challenge.points || 50} points
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <Button 
                        onClick={() => handleAcceptChallenge(challenge.id)}
                        disabled={loadingChallengeId === challenge.id}
                      >
                        {loadingChallengeId === challenge.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            En cours...
                          </>
                        ) : (
                          'Accepter le défi'
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
                
                {recommendedChallenges.length === 0 && (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    Aucun défi recommandé pour le moment
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="badges">
          {stats.badges && (
            <BadgeGrid 
              badges={stats.badges} 
              earnedBadgeIds={stats.badges.filter(b => b.unlocked).map(b => b.id)}
              progressFunction={calculateProgress}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;
