import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchBadges, fetchChallenges, completeChallenge } from '@/lib/gamificationService';
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

  useEffect(() => {
    const loadGamificationData = async () => {
      setIsLoading(true);
      try {
        // Load badges and challenges
        const badgesData = await fetchBadges();
        const challengesData = await fetchChallenges();
        
        // Convert badge data to ensure it's the correct type
        const typedBadges = badgesData.map(badge => ({
          ...badge,
          user_id: badge.user_id || user?.id || 'unknown',
          icon: badge.icon || 'award'
        }));
        
        setBadges(typedBadges);
        setChallenges(challengesData);
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
          c.id === challengeId ? { ...c, completed: true, progress: c.target || c.maxProgress || 0 } : c
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

  // Rest of the component...
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
            <BadgeGrid badges={badges} />
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
                  challenge={challenge}
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
