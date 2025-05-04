
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchChallenges, fetchUserChallenges, completeChallenge, fetchBadges } from '@/lib/gamificationService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Challenge, UserChallenge, Badge as BadgeType } from '@/types/gamification';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ChallengeItem from '@/components/gamification/ChallengeItem';
import BadgeGrid from '@/components/gamification/BadgeGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, CheckCircle2, Loader2 } from 'lucide-react';

const GamificationPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("challenges");
  const [completingChallengeId, setCompletingChallengeId] = useState<string | null>(null);

  // Fetch all available challenges
  const {
    data: challenges = [],
    isLoading: isLoadingChallenges,
  } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges,
  });

  // Fetch user's progress on challenges for today
  const {
    data: userChallenges = [],
    isLoading: isLoadingUserProgress,
    refetch: refetchUserChallenges
  } = useQuery({
    queryKey: ['userChallenges', user?.id],
    queryFn: () => user?.id ? fetchUserChallenges(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
  });

  // Fetch user's badges
  const {
    data: badgeData,
    isLoading: isLoadingBadges,
  } = useQuery({
    queryKey: ['badges', user?.id],
    queryFn: () => user?.id ? fetchBadges(user.id) : Promise.resolve({ all: [], earned: [] }),
    enabled: !!user?.id,
  });

  // Handle challenge completion
  const handleCompleteChallenge = async (challengeId: string) => {
    if (!user?.id) return;

    try {
      setCompletingChallengeId(challengeId);
      
      // Create challenge completion record
      await completeChallenge({
        user_id: user.id,
        challenge_id: challengeId,
        date: new Date().toISOString(),
        completed: true
      });
      
      // Refetch user challenges
      await refetchUserChallenges();
      
      toast({
        title: "Défi complété !",
        description: "Félicitations ! Vous avez gagné des points pour votre bien-être.",
      });
    } catch (error) {
      console.error('Error completing challenge:', error);
      toast({
        title: "Erreur",
        description: "Impossible de compléter le défi. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setCompletingChallengeId(null);
    }
  };

  // Check if a challenge is already completed
  const isChallengeCompleted = (challengeId: string): boolean => {
    return userChallenges.some(uc => uc.challenge_id === challengeId && uc.completed);
  };

  // Calculate total points earned today
  const calculateTodayPoints = (): number => {
    return userChallenges.reduce((sum, uc) => {
      if (uc.completed) {
        const challenge = challenges.find(c => c.id === uc.challenge_id);
        return sum + (challenge?.points || 0);
      }
      return sum;
    }, 0);
  };

  // Get badge progress percentage
  const getBadgeProgress = (threshold: number): number => {
    const points = calculateTodayPoints();
    return Math.min((points / threshold) * 100, 100);
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Défis et Badges</h1>
        <p className="text-muted-foreground">
          Complétez des défis quotidiens pour gagner des points et débloquez des badges.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-primary" />
            Votre progression
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Points aujourd'hui</span>
              <span className="text-3xl font-bold text-primary">{calculateTodayPoints()}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Défis complétés</span>
              <span className="text-3xl font-bold text-primary">
                {userChallenges.filter(uc => uc.completed).length}/{challenges.length}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Badges gagnés</span>
              <span className="text-3xl font-bold text-primary">
                {badgeData?.earned.length || 0}/{badgeData?.all.length || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="challenges">Défis quotidiens</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="challenges" className="space-y-4 mt-6">
          {isLoadingChallenges || isLoadingUserProgress ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {challenges.map((challenge) => (
                <ChallengeItem
                  key={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  points={challenge.points}
                  isCompleted={isChallengeCompleted(challenge.id)}
                  onComplete={() => handleCompleteChallenge(challenge.id)}
                  isLoading={completingChallengeId === challenge.id}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="badges" className="mt-6">
          {isLoadingBadges ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <BadgeGrid 
              badges={badgeData?.all || []} 
              earnedBadgeIds={badgeData?.earned.map(eb => eb.badge_id) || []}
              progressFunction={getBadgeProgress}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationPage;
