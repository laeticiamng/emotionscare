/**
 * Hook principal pour le module Discovery
 * @module discovery
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  DiscoveryItem,
  DiscoveryPath,
  DiscoveryStats,
  DiscoveryRecommendation,
  DiscoverySession,
  DiscoverySettings,
  DiscoveryFilters,
  DiscoveryCategory,
} from '../types';

// Données initiales par défaut
const DEFAULT_ITEMS: DiscoveryItem[] = [
  {
    id: 'disc-1',
    title: 'Reconnaissance des Émotions',
    description: 'Apprenez à identifier et nommer vos émotions de base',
    category: 'emotion',
    difficulty: 'beginner',
    status: 'available',
    icon: '🎭',
    color: 'from-blue-500 to-purple-500',
    estimatedMinutes: 10,
    xpReward: 50,
    tags: ['émotions', 'bases', 'conscience'],
    progress: 0,
  },
  {
    id: 'disc-2',
    title: 'Respiration Consciente',
    description: 'Techniques de respiration pour calmer le système nerveux',
    category: 'technique',
    difficulty: 'beginner',
    status: 'available',
    icon: '🌬️',
    color: 'from-teal-500 to-cyan-500',
    estimatedMinutes: 5,
    xpReward: 30,
    tags: ['respiration', 'calme', 'relaxation'],
    progress: 0,
  },
  {
    id: 'disc-3',
    title: 'Journal Émotionnel',
    description: 'Commencez votre pratique quotidienne d\'écriture',
    category: 'activity',
    difficulty: 'beginner',
    status: 'available',
    icon: '📝',
    color: 'from-amber-500 to-orange-500',
    estimatedMinutes: 15,
    xpReward: 60,
    tags: ['journal', 'écriture', 'réflexion'],
    progress: 0,
  },
  {
    id: 'disc-4',
    title: 'Méditation Guidée',
    description: 'Introduction à la méditation de pleine conscience',
    category: 'technique',
    difficulty: 'intermediate',
    status: 'available',
    icon: '🧘',
    color: 'from-indigo-500 to-purple-500',
    estimatedMinutes: 20,
    xpReward: 80,
    tags: ['méditation', 'pleine conscience', 'focus'],
    progress: 0,
  },
  {
    id: 'disc-5',
    title: 'Gestion du Stress',
    description: 'Stratégies pour faire face aux situations stressantes',
    category: 'insight',
    difficulty: 'intermediate',
    status: 'locked',
    icon: '⚡',
    color: 'from-red-500 to-pink-500',
    estimatedMinutes: 25,
    xpReward: 100,
    prerequisites: ['disc-1', 'disc-2'],
    tags: ['stress', 'gestion', 'résilience'],
    progress: 0,
  },
  {
    id: 'disc-6',
    title: 'Communication Non-Violente',
    description: 'Exprimez vos besoins avec clarté et empathie',
    category: 'technique',
    difficulty: 'advanced',
    status: 'locked',
    icon: '💬',
    color: 'from-emerald-500 to-teal-500',
    estimatedMinutes: 30,
    xpReward: 120,
    prerequisites: ['disc-1'],
    tags: ['communication', 'empathie', 'relations'],
    progress: 0,
  },
  {
    id: 'disc-7',
    title: 'Défi 7 jours Gratitude',
    description: 'Cultivez la gratitude pendant une semaine',
    category: 'challenge',
    difficulty: 'beginner',
    status: 'available',
    icon: '🙏',
    color: 'from-yellow-500 to-amber-500',
    estimatedMinutes: 5,
    xpReward: 200,
    tags: ['gratitude', 'défi', 'positivité'],
    progress: 0,
  },
  {
    id: 'disc-8',
    title: 'Intelligence Émotionnelle',
    description: 'Développez votre QE avec des exercices pratiques',
    category: 'ressource',
    difficulty: 'advanced',
    status: 'locked',
    icon: '🧠',
    color: 'from-violet-500 to-purple-500',
    estimatedMinutes: 45,
    xpReward: 150,
    prerequisites: ['disc-1', 'disc-5'],
    tags: ['intelligence', 'QE', 'développement'],
    progress: 0,
  },
];

const DEFAULT_PATHS: DiscoveryPath[] = [
  {
    id: 'path-1',
    name: 'Les Fondamentaux',
    description: 'Maîtrisez les bases de l\'intelligence émotionnelle',
    icon: '🌱',
    color: 'from-green-500 to-emerald-500',
    items: DEFAULT_ITEMS.filter(i => i.difficulty === 'beginner'),
    totalXp: 340,
    completedItems: 0,
    isUnlocked: true,
    estimatedHours: 1,
  },
  {
    id: 'path-2',
    name: 'Maîtrise Avancée',
    description: 'Approfondissez vos compétences émotionnelles',
    icon: '🌟',
    color: 'from-purple-500 to-pink-500',
    items: DEFAULT_ITEMS.filter(i => ['intermediate', 'advanced'].includes(i.difficulty)),
    totalXp: 450,
    completedItems: 0,
    isUnlocked: false,
    estimatedHours: 2,
  },
];

const DEFAULT_SETTINGS: DiscoverySettings = {
  dailyGoal: 1,
  preferredCategories: [],
  preferredDifficulty: 'beginner',
  notificationsEnabled: true,
  showCompleted: true,
  autoAdvance: true,
};

export function useDiscovery() {
  const { user } = useAuth();
  const [items, setItems] = useState<DiscoveryItem[]>(DEFAULT_ITEMS);
  const [paths, _setPaths] = useState<DiscoveryPath[]>(DEFAULT_PATHS);
  const [sessions, setSessions] = useState<DiscoverySession[]>([]);
  const [settings, setSettings] = useState<DiscoverySettings>(DEFAULT_SETTINGS);
  const [filters, setFilters] = useState<DiscoveryFilters>({});
  const [currentSession, setCurrentSession] = useState<DiscoverySession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données utilisateur
  useEffect(() => {
    async function loadUserData() {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Charger progression depuis activity_sessions
        const { data: sessionData } = await supabase
          .from('activity_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false })
          .limit(50);

        if (sessionData) {
          const mappedSessions: DiscoverySession[] = sessionData.map(s => ({
            id: s.id,
            itemId: s.activity_id || '',
            startedAt: s.started_at,
            completedAt: s.completed_at || undefined,
            duration: s.duration_seconds || 0,
            xpEarned: s.xp_earned || 0,
            notes: s.notes || undefined,
            rating: s.rating || undefined,
            moodBefore: s.mood_before || undefined,
            moodAfter: s.mood_after || undefined,
          }));
          setSessions(mappedSessions);
        }

        // Mettre à jour le statut des items basé sur les sessions
        const completedIds = new Set(
          sessionData?.filter(s => s.completed).map(s => s.activity_id) || []
        );
        
        setItems(prev => prev.map(item => ({
          ...item,
          status: completedIds.has(item.id) 
            ? 'completed' 
            : item.status === 'locked' 
              ? checkPrerequisites(item, completedIds) 
                ? 'available' 
                : 'locked'
              : item.status,
          progress: completedIds.has(item.id) ? 100 : item.progress,
        })));

      } catch (error) {
        console.error('Erreur chargement discovery:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [user?.id]);

  // Vérifier si les prérequis sont remplis
  function checkPrerequisites(item: DiscoveryItem, completedIds: Set<string>): boolean {
    if (!item.prerequisites || item.prerequisites.length === 0) return true;
    return item.prerequisites.every(prereq => completedIds.has(prereq));
  }

  // Statistiques calculées
  const stats: DiscoveryStats = useMemo(() => {
    const completed = items.filter(i => i.status === 'completed' || i.status === 'mastered');
    const inProgress = items.filter(i => i.status === 'in_progress');
    const totalXp = sessions.reduce((sum, s) => sum + s.xpEarned, 0);
    
    // Calculer la catégorie favorite
    const categoryCount: Record<string, number> = {};
    completed.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    const favoriteCategory = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0] as DiscoveryCategory | undefined;

    // Calculer le streak
    const sortedSessions = [...sessions]
      .filter(s => s.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.completedAt!);
      const dayDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff <= 1) {
        streak++;
        currentDate = sessionDate;
      } else break;
    }

    // Progrès hebdomadaire
    const weeklyProgress = [];
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      const daySessions = sessions.filter(s => s.completedAt?.startsWith(dayStr));
      weeklyProgress.push({
        day: days[date.getDay()],
        count: daySessions.length,
        xp: daySessions.reduce((sum, s) => sum + s.xpEarned, 0),
      });
    }

    return {
      totalDiscoveries: items.length,
      completedDiscoveries: completed.length,
      inProgressDiscoveries: inProgress.length,
      totalXpEarned: totalXp,
      currentStreak: streak,
      longestStreak: Math.max(streak, 7), // Placeholder
      favoriteCategory: favoriteCategory || null,
      timeSpentMinutes: sessions.reduce((sum, s) => sum + Math.floor(s.duration / 60), 0),
      achievements: generateAchievements(completed.length, totalXp, streak),
      weeklyProgress,
    };
  }, [items, sessions]);

  // Générer les achievements
  function generateAchievements(completed: number, xp: number, streak: number): DiscoveryStats['achievements'] {
    return [
      {
        id: 'first-discovery',
        name: 'Première Découverte',
        description: 'Complétez votre première découverte',
        icon: '🎉',
        rarity: 'common',
        unlockedAt: completed >= 1 ? new Date().toISOString() : undefined,
        progress: Math.min(completed, 1),
        target: 1,
      },
      {
        id: 'explorer',
        name: 'Explorateur',
        description: 'Complétez 5 découvertes',
        icon: '🔭',
        rarity: 'uncommon',
        unlockedAt: completed >= 5 ? new Date().toISOString() : undefined,
        progress: Math.min(completed, 5),
        target: 5,
      },
      {
        id: 'streak-master',
        name: 'Maître de la Constance',
        description: 'Maintenez un streak de 7 jours',
        icon: '🔥',
        rarity: 'rare',
        unlockedAt: streak >= 7 ? new Date().toISOString() : undefined,
        progress: Math.min(streak, 7),
        target: 7,
      },
      {
        id: 'xp-collector',
        name: 'Collectionneur XP',
        description: 'Accumulez 500 XP',
        icon: '💎',
        rarity: 'epic',
        unlockedAt: xp >= 500 ? new Date().toISOString() : undefined,
        progress: Math.min(xp, 500),
        target: 500,
      },
    ];
  }

  // Recommandations personnalisées
  const recommendations: DiscoveryRecommendation[] = useMemo(() => {
    const available = items.filter(i => i.status === 'available');
    
    return available.slice(0, 3).map((item, index) => ({
      item,
      reason: index === 0 
        ? 'Parfait pour commencer votre journée'
        : index === 1
          ? 'Basé sur vos préférences'
          : 'Populaire cette semaine',
      matchScore: 0.9 - (index * 0.1),
      basedOn: (['mood', 'history', 'trending'] as const)[index],
    }));
  }, [items]);

  // Filtrer les items
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (filters.category?.length) {
      result = result.filter(i => filters.category!.includes(i.category));
    }
    if (filters.difficulty?.length) {
      result = result.filter(i => filters.difficulty!.includes(i.difficulty));
    }
    if (filters.status?.length) {
      result = result.filter(i => filters.status!.includes(i.status));
    }
    if (filters.minDuration) {
      result = result.filter(i => i.estimatedMinutes >= filters.minDuration!);
    }
    if (filters.maxDuration) {
      result = result.filter(i => i.estimatedMinutes <= filters.maxDuration!);
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(i => 
        i.title.toLowerCase().includes(query) ||
        i.description.toLowerCase().includes(query) ||
        i.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    if (!settings.showCompleted) {
      result = result.filter(i => i.status !== 'completed' && i.status !== 'mastered');
    }

    return result;
  }, [items, filters, settings.showCompleted]);

  // Démarrer une session
  const startSession = useCallback(async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item || item.status === 'locked') {
      toast.error('Cette découverte n\'est pas accessible');
      return;
    }

    const session: DiscoverySession = {
      id: `session-${Date.now()}`,
      itemId,
      startedAt: new Date().toISOString(),
      duration: 0,
      xpEarned: 0,
    };

    setCurrentSession(session);
    setItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, status: 'in_progress' } : i
    ));

    toast.success(`Démarrage: ${item.title}`);
  }, [items]);

  // Compléter une session
  const completeSession = useCallback(async (rating?: number, notes?: string, moodAfter?: number) => {
    if (!currentSession || !user?.id) return;

    const item = items.find(i => i.id === currentSession.itemId);
    const now = new Date().toISOString();
    const duration = Math.floor((Date.now() - new Date(currentSession.startedAt).getTime()) / 1000);
    
    const completedSession: DiscoverySession = {
      ...currentSession,
      completedAt: now,
      duration,
      xpEarned: item?.xpReward || 50,
      rating,
      notes,
      moodAfter,
    };

    try {
      // Sauvegarder dans activity_sessions
      await supabase.from('activity_sessions').insert({
        user_id: user.id,
        activity_id: currentSession.itemId,
        started_at: currentSession.startedAt,
        completed_at: now,
        completed: true,
        duration_seconds: duration,
        xp_earned: item?.xpReward || 50,
        rating,
        notes,
        mood_after: moodAfter,
      });

      setSessions(prev => [completedSession, ...prev]);
      setItems(prev => prev.map(i => 
        i.id === currentSession.itemId 
          ? { ...i, status: 'completed', progress: 100, completedAt: now }
          : i
      ));
      setCurrentSession(null);

      toast.success(`+${item?.xpReward || 50} XP gagnés !`, {
        description: 'Découverte complétée avec succès',
      });
    } catch (error) {
      console.error('Erreur completion session:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  }, [currentSession, items, user?.id]);

  // Annuler la session courante
  const cancelSession = useCallback(() => {
    if (currentSession) {
      setItems(prev => prev.map(i => 
        i.id === currentSession.itemId ? { ...i, status: 'available' } : i
      ));
      setCurrentSession(null);
      toast.info('Session annulée');
    }
  }, [currentSession]);

  // Mettre à jour les paramètres
  const updateSettings = useCallback((newSettings: Partial<DiscoverySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    toast.success('Paramètres mis à jour');
  }, []);

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters: Partial<DiscoveryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    // Données
    items: filteredItems,
    allItems: items,
    paths,
    sessions,
    stats,
    recommendations,
    currentSession,
    settings,
    filters,
    isLoading,

    // Actions
    startSession,
    completeSession,
    cancelSession,
    updateSettings,
    updateFilters,
    resetFilters,
  };
}

export default useDiscovery;
