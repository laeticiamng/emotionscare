
import React, { useEffect, useState } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BadgeGrid from '@/components/gamification/BadgeGrid';
import ChallengeItem from '@/components/gamification/ChallengeItem';
import { fetchBadges, fetchChallenges, completeChallenge } from '@/lib/gamificationService';
import { Challenge } from '@/types/gamification';
import { useActivityLogging } from '@/hooks/useActivityLogging';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

const GamificationPage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Log page visit
  useActivityLogging('gamification');

  useEffect(() => {
    const loadGamificationData = async () => {
      try {
        // Load challenges
        const challengesData = await fetchChallenges();
        setChallenges(challengesData);
        
        // Load badges
        const badgeResponse = await fetchBadges();
        setBadges(badgeResponse.all);
        setEarnedBadgeIds(badgeResponse.earned.map(badge => badge.id));
      } catch (error) {
        console.error("Error loading gamification data:", error);
        toast.error("Erreur lors du chargement des données de gamification");
      }
    };
    
    loadGamificationData();
  }, []);

  const handleCompleteChallenge = async (challengeId: string) => {
    setIsLoading(true);
    try {
      const userId = user?.id || 'anonymous';
      const success = await completeChallenge(userId, challengeId);
      
      if (success) {
        setCompletedChallenges(prev => [...prev, challengeId]);
        toast.success("Défi complété avec succès!");
      }
    } catch (error) {
      console.error("Error completing challenge:", error);
      toast.error("Erreur lors de la complétion du défi");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate progress percentage for badges
  const calculateProgress = (threshold: number) => {
    // This is a simple mock calculation
    // In a real app, this would be calculated based on user activities
    return Math.min(Math.floor(Math.random() * threshold), threshold);
  };
  
  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Gamification</h1>
          <p className="text-muted-foreground">Relevez des défis et gagnez des récompenses</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Défis actifs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenges.map(challenge => (
                  <ChallengeItem 
                    key={challenge.id}
                    title={challenge.title}
                    description={challenge.description}
                    points={challenge.points}
                    isCompleted={completedChallenges.includes(challenge.id)}
                    onComplete={() => handleCompleteChallenge(challenge.id)}
                    isLoading={isLoading}
                  />
                ))}
                {challenges.length === 0 && (
                  <p className="text-center py-4 text-muted-foreground">
                    Aucun défi disponible actuellement
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Mes badges</CardTitle>
              </CardHeader>
              <CardContent>
                <BadgeGrid 
                  badges={badges} 
                  earnedBadgeIds={earnedBadgeIds} 
                  progressFunction={calculateProgress}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default GamificationPage;
