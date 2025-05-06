
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Badge, Challenge, UserChallenge } from '@/types';
import { fetchBadges, fetchChallenges, fetchUserChallenges, completeChallenge, BadgeResponse } from '@/lib/gamificationService';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, CheckCircle, Calendar, Star, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const GamificationPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('badges');

  // Fetch badges
  const { 
    data: badgesData,
    isLoading: isLoadingBadges,
    error: badgesError
  } = useQuery({
    queryKey: ['badges'],
    queryFn: fetchBadges
  });

  // Fetch challenges
  const { 
    data: challenges,
    isLoading: isLoadingChallenges 
  } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges
  });

  // Fetch user challenges
  const { 
    data: userChallenges,
    isLoading: isLoadingUserChallenges,
    refetch: refetchUserChallenges
  } = useQuery({
    queryKey: ['userChallenges'],
    queryFn: fetchUserChallenges
  });

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      await completeChallenge(challengeId);
      await refetchUserChallenges();
      toast({
        title: "Défi complété !",
        description: "Vous avez gagné des points de bien-être. Continuez comme ça !",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de compléter ce défi pour le moment.",
        variant: "destructive"
      });
    }
  };

  // Helper function to check if a challenge is completed
  const isChallengeCompleted = (challengeId: string): boolean => {
    if (!userChallenges) return false;
    return userChallenges.some(uc => uc.challenge_id === challengeId && uc.completed);
  };

  // Loading state
  if (isLoadingBadges || isLoadingChallenges || isLoadingUserChallenges) {
    return (
      <DashboardContainer>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </DashboardContainer>
    );
  }

  // Error state
  if (badgesError) {
    return (
      <DashboardContainer>
        <div className="text-center py-12">
          <p className="text-destructive">Erreur lors du chargement des données de gamification</p>
        </div>
      </DashboardContainer>
    );
  }

  // Calculate progress for badge section
  const badgeProgress = badgesData ? {
    earned: badgesData.earned.length,
    total: badgesData.all.length,
    percentage: badgesData.all.length > 0 
      ? Math.round((badgesData.earned.length / badgesData.all.length) * 100) 
      : 0
  } : { earned: 0, total: 0, percentage: 0 };

  return (
    <DashboardContainer>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gamification &amp; Défis</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progress Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-500" />
                Votre progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-2">
                <span>Badges débloqués</span>
                <span className="font-medium">{badgeProgress.earned}/{badgeProgress.total}</span>
              </div>
              <Progress value={badgeProgress.percentage} className="h-2 mb-4" />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white/70 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{badgeProgress.earned}</div>
                  <div className="text-xs text-gray-500">Badges gagnés</div>
                </div>
                <div className="bg-white/70 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-600">300</div>
                  <div className="text-xs text-gray-500">Points totaux</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Streak Card */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                Séquence actuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-green-600 mb-2">5</div>
                <div className="text-gray-600 mb-3">jours consécutifs</div>
                <div className="grid grid-cols-7 gap-1 w-full">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i}
                      className={`h-8 rounded-full flex items-center justify-center ${
                        i < 5 ? 'bg-green-500 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {i < 5 && <CheckCircle className="h-4 w-4" />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Rank Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-500" />
                Votre rang
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-lg font-bold text-purple-600">Explorateur des émotions</div>
                <div className="text-sm text-gray-500">Niveau 2</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="challenges">Défis quotidiens</TabsTrigger>
          </TabsList>
          
          <TabsContent value="badges" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {badgesData && badgesData.all.map((badge) => (
                <Card 
                  key={badge.id}
                  className={`${
                    badge.unlocked 
                      ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white' 
                      : 'opacity-70 bg-gray-50'
                  }`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {badge.unlocked && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                      {badge.name}
                    </CardTitle>
                    <CardDescription>{badge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center p-4">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                        badge.unlocked ? 'bg-emerald-100' : 'bg-gray-200'
                      }`}>
                        <Award className={`h-10 w-10 ${
                          badge.unlocked ? 'text-emerald-600' : 'text-gray-400'
                        }`} />
                      </div>
                    </div>
                    {!badge.unlocked && badge.threshold && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progression</span>
                          <span>0/{badge.threshold}</span>
                        </div>
                        <Progress value={0} className="h-1" />
                      </div>
                    )}
                    {badge.unlocked && (
                      <div className="flex justify-center mt-2">
                        <BadgeUI variant="secondary">Obtenu</BadgeUI>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="challenges" className="mt-6">
            <div className="space-y-4">
              {challenges && challenges.map((challenge) => {
                const completed = isChallengeCompleted(challenge.id);
                return (
                  <Card 
                    key={challenge.id}
                    className={completed ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white' : ''}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {completed && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                          {challenge.title}
                        </CardTitle>
                        <Badge className="bg-blue-500">{challenge.points} pts</Badge>
                      </div>
                      <CardDescription>{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {challenge.requirements}
                          </div>
                          <div className="text-gray-500 text-xs">
                            Catégorie: {challenge.category}
                          </div>
                        </div>
                        {!completed && (
                          <Button 
                            size="sm" 
                            onClick={() => handleCompleteChallenge(challenge.id)}
                          >
                            Compléter
                          </Button>
                        )}
                        {completed && (
                          <Badge className="bg-emerald-500">Complété</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardContainer>
  );
};

export default GamificationPage;
