
import React, { useEffect, useState } from 'react';
import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BadgeGrid from '@/components/gamification/BadgeGrid';
import ChallengeItem from '@/components/gamification/ChallengeItem';
import { completeChallenge } from '@/lib/gamificationService';
import { Challenge } from '@/types/gamification';
import { Badge } from '@/types';
import { useActivityLogging } from '@/hooks/useActivityLogging';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

// Mock data for development
const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Saisir une émotion quotidienne',
    description: 'Utilisez l\'outil d\'analyse d\'émotions une fois par jour',
    points: 20
  },
  {
    id: '2',
    title: 'Compléter une session de relaxation',
    description: 'Suivez une séance de relaxation VR complète',
    points: 30
  }
];

const mockBadges = {
  all: [
    {
      id: '1',
      name: 'Explorateur',
      description: 'A exploré toutes les fonctionnalités',
      image_url: '/badges/explorer.svg',
      level: 1,
      threshold: 100,
      progress: 45,
      unlocked: false
    },
    {
      id: '2',
      name: 'Zen Master',
      description: 'A complété 10 sessions de relaxation',
      image_url: '/badges/zen.svg',
      level: 2,
      threshold: 10,
      progress: 3,
      unlocked: false
    }
  ],
  earned: [
    {
      id: '3',
      name: 'Premier pas',
      description: 'A rejoint la plateforme',
      image_url: '/badges/first-steps.svg',
      level: 1,
      unlocked: true
    }
  ]
};

const GamificationPage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Log page visit
  useActivityLogging('gamification');

  useEffect(() => {
    const loadGamificationData = async () => {
      try {
        // Load challenges
        setChallenges(mockChallenges);
        
        // Load badges
        setBadges(mockBadges.all);
        setEarnedBadgeIds(mockBadges.earned.map(badge => badge.id));
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
      const success = await completeChallenge(challengeId);
      
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
    <ProtectedLayoutWrapper>
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
    </ProtectedLayoutWrapper>
  );
};

export default GamificationPage;
