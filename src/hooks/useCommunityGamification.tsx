
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useOpenAI } from '@/hooks/ai/useOpenAI';
import { Badge, Challenge } from '@/types/gamification';

interface GamificationStats {
  level: number;
  points: number;
  nextLevelPoints: number;
  badges: Badge[];
  challenges: Challenge[];
  recentAchievements: {
    type: 'badge' | 'challenge' | 'level';
    id: string;
    name: string;
    timestamp: Date;
    points?: number;
  }[];
}

export function useCommunityGamification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { challenges: aiChallenges } = useOpenAI();
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState<Challenge[]>([]);
  
  // Charger les statistiques de gamification
  const loadGamificationStats = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Dans une implémentation réelle, nous chargerions ces données depuis la base de données
      // Pour cette démonstration, nous simulons des données
      const mockStats: GamificationStats = {
        level: 3,
        points: 2750,
        nextLevelPoints: 3000,
        badges: [
          {
            id: 'badge-1',
            name: 'Premier pas',
            description: 'A rejoint la communauté',
            image_url: '/badges/first-step.png',
            unlocked_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
            unlocked: true,
            category: 'onboarding',
            level: 1,
            user_id: user.id
          },
          {
            id: 'badge-2',
            name: 'Soutien communautaire',
            description: 'A aidé 5 membres',
            image_url: '/badges/community-support.png',
            unlocked_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
            unlocked: true,
            category: 'community',
            level: 2,
            user_id: user.id
          },
          {
            id: 'badge-3',
            name: 'Créateur de contenu',
            description: 'A créé 10 publications de qualité',
            image_url: '/badges/content-creator.png',
            unlocked_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
            unlocked: true,
            category: 'content',
            level: 2,
            user_id: user.id
          }
        ],
        challenges: [
          {
            id: 'challenge-1',
            title: 'Partage de connaissance',
            name: 'Partage de connaissance',
            description: 'Créez une publication éducative dans la communauté',
            progress: 0,
            total: 1,
            points: 100,
            completed: false,
            category: 'social'
          },
          {
            id: 'challenge-2',
            title: 'Connecteur',
            name: 'Connecteur',
            description: 'Connectez-vous avec 3 nouveaux membres',
            progress: 1,
            total: 3,
            points: 150,
            completed: false,
            category: 'social'
          }
        ],
        recentAchievements: [
          {
            type: 'badge',
            id: 'badge-3',
            name: 'Créateur de contenu',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            points: 200
          },
          {
            type: 'level',
            id: 'level-3',
            name: 'Niveau 3',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
            points: 0
          }
        ]
      };
      
      setStats(mockStats);
      setActiveChallenges(mockStats.challenges);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données de gamification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);
  
  // Générer des défis personnalisés avec OpenAI
  const generatePersonalizedChallenges = useCallback(async (userEmotion?: string) => {
    try {
      if (!user) return;
      
      const emotion = userEmotion || 'neutral';
      
      const emotionChallenges: Record<string, Challenge[]> = {
        'calm': [
          {
            id: 'ai-challenge-calm-1',
            title: 'Journal de gratitude',
            name: 'Journal de gratitude',
            description: 'Partagez trois choses pour lesquelles vous êtes reconnaissant aujourd\'hui',
            progress: 0,
            total: 1,
            points: 50,
            completed: false,
            category: 'wellness'
          }
        ],
        'energetic': [
          {
            id: 'ai-challenge-energetic-1',
            title: 'Motivation matinale',
            name: 'Motivation matinale',
            description: 'Partagez votre routine matinale énergisante avec la communauté',
            progress: 0,
            total: 1,
            points: 50,
            completed: false,
            category: 'wellness'
          }
        ],
        'creative': [
          {
            id: 'ai-challenge-creative-1',
            title: 'Inspiration créative',
            name: 'Inspiration créative',
            description: 'Partagez une source d\'inspiration qui a stimulé votre créativité récemment',
            progress: 0,
            total: 1,
            points: 75,
            completed: false,
            category: 'creative'
          }
        ],
        'reflective': [
          {
            id: 'ai-challenge-reflective-1',
            title: 'Question philosophique',
            name: 'Question philosophique',
            description: 'Posez une question réflexive à la communauté et engagez une discussion profonde',
            progress: 0,
            total: 1,
            points: 75,
            completed: false,
            category: 'intellectual'
          }
        ],
        'anxious': [
          {
            id: 'ai-challenge-anxious-1',
            title: 'Technique anti-stress',
            name: 'Technique anti-stress',
            description: 'Partagez une technique efficace pour gérer l\'anxiété que vous avez personnellement testée',
            progress: 0,
            total: 1,
            points: 50,
            completed: false,
            category: 'wellness'
          }
        ],
        'neutral': [
          {
            id: 'ai-challenge-neutral-1',
            title: 'Connexion communautaire',
            name: 'Connexion communautaire',
            description: 'Commentez sur 3 publications d\'autres membres pour créer des liens',
            progress: 0,
            total: 3,
            points: 60,
            completed: false,
            category: 'social'
          }
        ]
      };
      
      const challenges = emotionChallenges[emotion] || emotionChallenges.neutral;
      setRecommendedChallenges(challenges);
      
      return challenges;
    } catch (error) {
      console.error("Erreur lors de la génération des défis:", error);
      return [];
    }
  }, [user]);
  
  // Accepter un défi
  const acceptChallenge = useCallback(async (challengeId: string) => {
    try {
      const challenge = [...activeChallenges, ...recommendedChallenges].find(c => c.id === challengeId);
      
      if (!challenge) {
        throw new Error("Défi non trouvé");
      }
      
      // Dans une implémentation réelle, nous sauvegarderions cette action dans la base de données
      
      // Ajouter le défi aux défis actifs s'il n'y est pas déjà
      if (!activeChallenges.some(c => c.id === challengeId)) {
        setActiveChallenges(prev => [...prev, challenge]);
      }
      
      // Retirer le défi des recommandations
      setRecommendedChallenges(prev => prev.filter(c => c.id !== challengeId));
      
      toast({
        title: "Défi accepté",
        description: `Vous avez accepté le défi "${challenge.name}"`,
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'acceptation du défi:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter le défi",
        variant: "destructive"
      });
      return false;
    }
  }, [activeChallenges, recommendedChallenges, toast]);
  
  // Compléter un défi
  const completeChallenge = useCallback(async (challengeId: string) => {
    try {
      // Mettre à jour les défis actifs
      const updatedChallenges = activeChallenges.map(challenge => {
        if (challenge.id === challengeId) {
          return { ...challenge, completed: true, progress: challenge.total };
        }
        return challenge;
      });
      
      setActiveChallenges(updatedChallenges);
      
      // Mettre à jour les statistiques générales
      if (stats) {
        const challenge = activeChallenges.find(c => c.id === challengeId);
        const points = challenge?.points || 50;
        
        const newAchievement = {
          type: 'challenge' as const,
          id: challengeId,
          name: challenge?.name || 'Défi complété',
          timestamp: new Date(),
          points
        };
        
        setStats({
          ...stats,
          points: stats.points + points,
          recentAchievements: [newAchievement, ...stats.recentAchievements]
        });
      }
      
      toast({
        title: "Défi complété",
        description: "Félicitations ! Vous avez complété le défi avec succès !",
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la complétion du défi:", error);
      toast({
        title: "Erreur",
        description: "Impossible de compléter le défi",
        variant: "destructive"
      });
      return false;
    }
  }, [activeChallenges, stats, toast]);
  
  // Initialiser le chargement des données
  useEffect(() => {
    if (user) {
      loadGamificationStats();
      generatePersonalizedChallenges();
    }
  }, [user, loadGamificationStats, generatePersonalizedChallenges]);
  
  return {
    stats,
    isLoading,
    activeChallenges,
    recommendedChallenges,
    generatePersonalizedChallenges,
    acceptChallenge,
    completeChallenge,
    refresh: loadGamificationStats
  };
}
