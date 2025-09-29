import { useState, useEffect, useCallback } from 'react';
import { GritStats, GritChallenge, GritSession, BossLevelGritContextType } from '@/types/boss-level-grit';

export const useBossLevelGrit = (): BossLevelGritContextType => {
  const [stats, setStats] = useState<GritStats | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<GritChallenge | null>(null);
  const [activeSession, setActiveSession] = useState<GritSession | null>(null);
  const [availableChallenges, setAvailableChallenges] = useState<GritChallenge[]>([]);
  const [mindsets] = useState([
    {
      id: 'warrior-mindset',
      name: 'Mentalité de Guerrier',
      description: 'Développez une mentalité inébranlable face aux défis',
      techniques: ['Visualisation de victoire', 'Affirmations de force', 'Respiration de combat'],
      affirmations: [
        'Je suis plus fort que mes défis',
        'Chaque obstacle me rend plus résilient',
        'Je transforme la pression en performance'
      ],
      visualizations: [
        'Imaginez-vous surmonter avec succès le défi actuel',
        'Visualisez votre force intérieure comme une armure brillante',
        'Voyez-vous célébrer votre victoire avec fierté'
      ],
      breathingPatterns: ['4-4-4-4 (Combat breath)', '4-7-8 (Calming breath)'],
      applicableContexts: ['Stress intense', 'Défis majeurs', 'Moments de doute']
    },
    {
      id: 'growth-mindset',
      name: 'Mentalité de Croissance',
      description: 'Transformez chaque échec en opportunité d\'apprentissage',
      techniques: ['Reframing cognitif', 'Questions de croissance', 'Célébration des progrès'],
      affirmations: [
        'Chaque échec est une leçon déguisée',
        'Je grandis à travers chaque expérience',
        'Mes limites d\'aujourd\'hui sont mes tremplins de demain'
      ],
      visualizations: [
        'Voyez vos compétences grandir comme un arbre fort',
        'Imaginez votre cerveau créant de nouvelles connexions',
        'Visualisez votre future version améliorée'
      ],
      breathingPatterns: ['5-5-5 (Equilibrium breath)', '6-2-6-2 (Learning breath)'],
      applicableContexts: ['Apprentissage', 'Après un échec', 'Développement de compétences']
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialisation des données
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setIsLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockStats: GritStats = {
        totalXp: 2450,
        currentLevel: {
          id: 'warrior',
          name: 'Guerrier Mental',
          description: 'Vous maîtrisez les bases de la résilience',
          minXp: 2000,
          maxXp: 5000,
          color: 'hsl(var(--primary))',
          icon: '⚔️',
          benefits: ['Défis avancés débloqués', 'Sessions personnalisées'],
          unlockedFeatures: ['Challenges Master', 'Mindset Builder']
        },
        nextLevel: {
          id: 'master',
          name: 'Maître de la Résilience',
          description: 'Expert en gestion du stress',
          minXp: 5000,
          maxXp: 10000,
          color: 'hsl(var(--accent))',
          icon: '🏆',
          benefits: ['Défis légendaires', 'Coaching personnalisé'],
          unlockedFeatures: ['Legend Challenges', 'Personal Coach']
        },
        completedChallenges: 23,
        currentStreak: 7,
        longestStreak: 14,
        averageScore: 87,
        totalSessionTime: 1240,
        categoriesProgress: {
          mental: 85,
          physical: 60,
          emotional: 75,
          spiritual: 45
        },
        achievements: []
      };

      const mockChallenges: GritChallenge[] = [
        {
          id: 'mental-fortress',
          title: 'Forteresse Mentale',
          description: 'Développez votre résistance au stress',
          difficulty: 'warrior',
          category: 'mental',
          duration: 15,
          xpReward: 200,
          completionRate: 78,
          status: 'available',
          tags: ['Visualisation', 'Stress'],
          createdAt: new Date()
        }
      ];

      setStats(mockStats);
      setAvailableChallenges(mockChallenges);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startChallenge = useCallback(async (challengeId: string) => {
    setIsLoading(true);
    try {
      const challenge = availableChallenges.find(c => c.id === challengeId);
      if (!challenge) {
        throw new Error('Défi non trouvé');
      }

      setCurrentChallenge(challenge);
      
      const session: GritSession = {
        id: `session-${Date.now()}`,
        challengeId,
        userId: 'current-user', // À remplacer par l'ID utilisateur réel
        startTime: new Date(),
        duration: 0,
        difficulty: 5,
        completionScore: 0,
        emotionalState: {
          before: 'neutral',
          after: 'neutral',
          confidence: 5
        },
        insights: [],
        nextRecommendations: []
      };

      setActiveSession(session);
    } catch (error) {
      console.error('Erreur lors du démarrage du défi:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [availableChallenges]);

  const completeChallenge = useCallback(async (score: number, insights?: string[]) => {
    if (!activeSession || !currentChallenge) {
      throw new Error('Aucune session active');
    }

    setIsLoading(true);
    try {
      const completedSession: GritSession = {
        ...activeSession,
        endTime: new Date(),
        duration: Math.floor((Date.now() - activeSession.startTime.getTime()) / 1000),
        completionScore: score,
        insights: insights || [],
        emotionalState: {
          ...activeSession.emotionalState,
          after: score > 80 ? 'confident' : score > 60 ? 'satisfied' : 'neutral'
        }
      };

      // Mise à jour des stats
      if (stats) {
        const newStats: GritStats = {
          ...stats,
          totalXp: stats.totalXp + currentChallenge.xpReward,
          completedChallenges: stats.completedChallenges + 1,
          totalSessionTime: stats.totalSessionTime + completedSession.duration / 60,
          averageScore: Math.round(
            (stats.averageScore * stats.completedChallenges + score) / 
            (stats.completedChallenges + 1)
          )
        };

        setStats(newStats);
      }

      // Reset de la session
      setActiveSession(null);
      setCurrentChallenge(null);

      console.log('Défi complété avec succès:', completedSession);
    } catch (error) {
      console.error('Erreur lors de la complétion du défi:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [activeSession, currentChallenge, stats]);

  const updateProgress = useCallback((progress: number) => {
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        completionScore: progress
      });
    }
  }, [activeSession]);

  const getRecommendations = useCallback((): GritChallenge[] => {
    if (!stats) return [];

    // Logique de recommandation basée sur les stats
    const { categoriesProgress } = stats;
    const weakestCategory = Object.entries(categoriesProgress)
      .sort(([,a], [,b]) => a - b)[0][0];

    return availableChallenges
      .filter(challenge => 
        challenge.category === weakestCategory && 
        challenge.status === 'available'
      )
      .slice(0, 3);
  }, [stats, availableChallenges]);

  const unlockNextLevel = useCallback(async (): Promise<boolean> => {
    if (!stats) return false;

    if (stats.totalXp >= stats.nextLevel.minXp) {
      const updatedStats: GritStats = {
        ...stats,
        currentLevel: stats.nextLevel,
        nextLevel: {
          id: 'legend',
          name: 'Légende Vivante',
          description: 'Niveau ultime de maîtrise',
          minXp: 10000,
          maxXp: 20000,
          color: 'hsl(var(--destructive))',
          icon: '👑',
          benefits: ['Accès illimité', 'Mentorat exclusif'],
          unlockedFeatures: ['All Access', 'Exclusive Mentoring']
        }
      };

      setStats(updatedStats);
      return true;
    }

    return false;
  }, [stats]);

  return {
    stats,
    currentChallenge,
    activeSession,
    availableChallenges,
    mindsets,
    isLoading,
    startChallenge,
    completeChallenge,
    updateProgress,
    getRecommendations,
    unlockNextLevel
  };
};

export default useBossLevelGrit;