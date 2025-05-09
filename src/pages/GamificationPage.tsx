
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getChallenges as fetchChallenges, getUserBadges as fetchBadges, completeChallenge } from '@/lib/gamificationService';
import { Badge, Challenge } from '@/types';
import BadgeGrid from '@/components/gamification/BadgeGrid';
import ChallengeItem from '@/components/gamification/ChallengeItem';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';

const GamificationPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeTab, setActiveTab] = useState('badges');
  const [isLoading, setIsLoading] = useState(true);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);

  // Function to calculate progress for badges
  const calculateProgress = (threshold: number) => {
    // Mock implementation - in a real app this would use actual user data
    return Math.floor(Math.random() * threshold);
  };

  useEffect(() => {
    const loadGamificationData = async () => {
      setIsLoading(true);
      try {
        // Load badges and challenges
        if (user?.id) {
          const badgesData = await fetchBadges(user.id);
          const challengesData = await fetchChallenges();

          // Set earned badge IDs
          const earnedIds = badgesData
            .filter(badge => badge.unlocked)
            .map(badge => badge.id);

          setEarnedBadgeIds(earnedIds);
          setBadges(badgesData);
          setChallenges(challengesData);
        }
      } catch (error) {
        console.error('Error loading gamification data:', error);
        toast({
          title: 'Erreur',
          description: "Impossible de charger les données de gamification.",
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadGamificationData();
    }
  }, [user, toast]);

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      await completeChallenge(challengeId);
      
      // Update challenges
      setChallenges(prev =>
        prev.map(c =>
          c.id === challengeId ? { ...c, completed: true } : c
        )
      );
      
      toast({
        title: 'Défi complété !',
        description: 'Félicitations pour avoir relevé ce défi !',
      });
    } catch (error) {
      console.error('Error completing challenge:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de compléter le défi.",
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gamification</h1>
        <p className="text-muted-foreground">
          Suivez vos progrès, gagnez des badges et relevez des défis pour améliorer votre bien-être
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="challenges">Défis</TabsTrigger>
        </TabsList>

        <TabsContent value="badges">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <BadgeGrid 
              badges={badges} 
              earnedBadgeIds={earnedBadgeIds}
              progressFunction={calculateProgress}
            />
          )}
        </TabsContent>

        <TabsContent value="challenges">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {challenges.map(challenge => (
                <ChallengeItem
                  key={challenge.id}
                  id={challenge.id}
                  title={challenge.title || challenge.name || ''}
                  description={challenge.description}
                  points={challenge.points || 0}
                  isCompleted={challenge.completed}
                  onComplete={handleCompleteChallenge}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default function WrappedGamificationPage() {
  return (
    <ProtectedLayoutWrapper>
      <GamificationPage />
    </ProtectedLayoutWrapper>
  );
}
