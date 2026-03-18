// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { GritStats, GritChallenge, GritSession, BossLevelGritContextType } from '@/types/boss-level-grit';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user profile for XP / level info
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level, streak_days')
        .eq('id', user.id)
        .single();

      const totalXp = profile?.xp || 0;
      const level = profile?.level || 1;

      // Fetch completed challenges count
      const { count: completedCount } = await supabase
        .from('user_challenges')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', true);

      // Fetch user achievements
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id);

      const fetchedStats: GritStats = {
        totalXp,
        currentLevel: {
          id: `level-${level}`,
          name: `Niveau ${level}`,
          description: '',
          minXp: (level - 1) * 1000,
          maxXp: level * 1000,
          color: 'hsl(var(--primary))',
          icon: '⚔️',
          benefits: [],
          unlockedFeatures: []
        },
        nextLevel: {
          id: `level-${level + 1}`,
          name: `Niveau ${level + 1}`,
          description: '',
          minXp: level * 1000,
          maxXp: (level + 1) * 1000,
          color: 'hsl(var(--accent))',
          icon: '🏆',
          benefits: [],
          unlockedFeatures: []
        },
        completedChallenges: completedCount || 0,
        currentStreak: profile?.streak_days || 0,
        longestStreak: profile?.streak_days || 0,
        averageScore: 0,
        totalSessionTime: 0,
        categoriesProgress: {
          mental: 0,
          physical: 0,
          emotional: 0,
          spiritual: 0
        },
        achievements: (achievements ?? []).map((a: any) => a.achievement_id)
      };

      // Fetch available challenges
      const { data: challengesData } = await supabase
        .from('challenges')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      const fetchedChallenges: GritChallenge[] = (challengesData ?? []).map((row: any) => ({
        id: row.id,
        title: row.title || row.name,
        description: row.description || '',
        difficulty: row.difficulty || 'warrior',
        category: row.category || 'mental',
        duration: row.duration || 15,
        xpReward: row.xp_reward || 100,
        completionRate: 0,
        status: 'available',
        tags: row.tags || [],
        createdAt: new Date(row.created_at)
      }));

      setStats(fetchedStats);
      setAvailableChallenges(fetchedChallenges);
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation', error as Error, 'UI');
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
      logger.error('Erreur lors du démarrage du défi', error as Error, 'UI');
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

      logger.info('Défi complété avec succès', completedSession, 'UI');
    } catch (error) {
      logger.error('Erreur lors de la complétion du défi', error as Error, 'UI');
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