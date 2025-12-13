/**
 * useEmotionalParkEnriched - Hook enrichi pour le Parc Émotionnel
 * Gère les attractions, quêtes, progression et expérience immersive
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export type EmotionZone = 'joy' | 'calm' | 'courage' | 'wonder' | 'connection' | 'growth';
export type AttractionType = 'experience' | 'game' | 'meditation' | 'challenge' | 'discovery' | 'social';

export interface ParkAttraction {
  id: string;
  name: string;
  description: string;
  zone: EmotionZone;
  type: AttractionType;
  icon: string;
  duration: number; // minutes
  energyCost: number;
  rewards: {
    xp: number;
    coins: number;
    badge?: string;
  };
  unlockRequirements: {
    level?: number;
    badges?: string[];
    questsCompleted?: string[];
  };
  position: { x: number; y: number };
  isUnlocked: boolean;
  isCompleted: boolean;
  completionCount: number;
  lastVisited: string | null;
}

export interface ParkQuest {
  id: string;
  title: string;
  description: string;
  zone: EmotionZone;
  objectives: {
    id: string;
    description: string;
    target: number;
    current: number;
    completed: boolean;
  }[];
  rewards: {
    xp: number;
    coins: number;
    badge?: string;
    unlockAttraction?: string;
  };
  deadline?: string;
  isActive: boolean;
  isCompleted: boolean;
  progress: number; // 0-100
}

export interface ParkProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  energy: number;
  maxEnergy: number;
  energyRegenRate: number; // per hour
  visitStreak: number;
  totalVisits: number;
  attractionsUnlocked: number;
  attractionsCompleted: number;
  questsCompleted: number;
  badges: string[];
  favoriteZone: EmotionZone | null;
}

export interface ParkWeather {
  type: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'magical';
  intensity: number;
  mood: number;
  description: string;
}

const ZONES: Record<EmotionZone, { name: string; color: string; description: string }> = {
  joy: {
    name: 'Jardin de la Joie',
    color: '#FFD700',
    description: 'Un espace lumineux dédié au bonheur et à la célébration',
  },
  calm: {
    name: 'Oasis de Sérénité',
    color: '#87CEEB',
    description: 'Un havre de paix pour la méditation et le repos',
  },
  courage: {
    name: 'Forteresse du Courage',
    color: '#FF6B6B',
    description: 'Des défis pour développer confiance et bravoure',
  },
  wonder: {
    name: 'Vallée des Merveilles',
    color: '#9B59B6',
    description: 'Exploration et découverte de soi',
  },
  connection: {
    name: 'Place de l\'Amitié',
    color: '#2ECC71',
    description: 'Espace social et connexion avec les autres',
  },
  growth: {
    name: 'Tour de l\'Évolution',
    color: '#E67E22',
    description: 'Apprentissage et développement personnel',
  },
};

const STORAGE_KEY = 'emotional_park_progress';
const ENERGY_REGEN_INTERVAL = 10 * 60 * 1000; // 10 minutes

export function useEmotionalParkEnriched() {
  const { user } = useAuth();
  
  const [attractions, setAttractions] = useState<ParkAttraction[]>([]);
  const [quests, setQuests] = useState<ParkQuest[]>([]);
  const [progress, setProgress] = useState<ParkProgress>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    coins: 50,
    energy: 100,
    maxEnergy: 100,
    energyRegenRate: 10,
    visitStreak: 0,
    totalVisits: 0,
    attractionsUnlocked: 0,
    attractionsCompleted: 0,
    questsCompleted: 0,
    badges: [],
    favoriteZone: null,
  });
  const [weather, setWeather] = useState<ParkWeather>({
    type: 'sunny',
    intensity: 0.7,
    mood: 75,
    description: 'Une belle journée dans le parc',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentZone, setCurrentZone] = useState<EmotionZone | null>(null);

  // Load progress from Supabase or localStorage
  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);

      try {
        if (user) {
          // Load from Supabase
          const { data, error } = await supabase
            .from('user_settings')
            .select('value')
            .eq('user_id', user.id)
            .eq('key', 'emotional_park_progress')
            .maybeSingle();

          if (!error && data?.value) {
            const parsed = JSON.parse(data.value);
            setProgress(parsed.progress || progress);
            setAttractions(parsed.attractions || []);
            setQuests(parsed.quests || []);
          }
        } else {
          // Load from localStorage
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            setProgress(parsed.progress || progress);
            setAttractions(parsed.attractions || []);
            setQuests(parsed.quests || []);
          }
        }

        // Initialize attractions if empty
        if (attractions.length === 0) {
          initializeAttractions();
        }

        // Update weather based on user's mood history
        updateWeather();
      } catch (err) {
        logger.error('Failed to load park progress', err as Error, 'PARK');
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  // Save progress
  const saveProgress = useCallback(async () => {
    const data = {
      progress,
      attractions,
      quests,
      lastSaved: new Date().toISOString(),
    };

    if (user) {
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        key: 'emotional_park_progress',
        value: JSON.stringify(data),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,key' });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [user, progress, attractions, quests]);

  // Auto-save on changes
  useEffect(() => {
    if (!isLoading) {
      saveProgress();
    }
  }, [progress, attractions, quests, isLoading, saveProgress]);

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev.energy >= prev.maxEnergy) return prev;
        const regenAmount = prev.energyRegenRate / 6; // Per 10 min
        return {
          ...prev,
          energy: Math.min(prev.maxEnergy, prev.energy + regenAmount),
        };
      });
    }, ENERGY_REGEN_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Initialize default attractions
  const initializeAttractions = () => {
    const defaultAttractions: ParkAttraction[] = [
      // Joy Zone
      {
        id: 'joy-carousel',
        name: 'Carrousel des Souvenirs',
        description: 'Revivez vos plus beaux moments de bonheur',
        zone: 'joy',
        type: 'experience',
        icon: '🎠',
        duration: 5,
        energyCost: 10,
        rewards: { xp: 20, coins: 5 },
        unlockRequirements: {},
        position: { x: 20, y: 30 },
        isUnlocked: true,
        isCompleted: false,
        completionCount: 0,
        lastVisited: null,
      },
      {
        id: 'joy-fountain',
        name: 'Fontaine de Gratitude',
        description: 'Exprimez votre reconnaissance et récoltez la joie',
        zone: 'joy',
        type: 'meditation',
        icon: '⛲',
        duration: 10,
        energyCost: 15,
        rewards: { xp: 35, coins: 10 },
        unlockRequirements: { level: 2 },
        position: { x: 35, y: 25 },
        isUnlocked: false,
        isCompleted: false,
        completionCount: 0,
        lastVisited: null,
      },
      // Calm Zone
      {
        id: 'calm-lake',
        name: 'Lac de la Tranquillité',
        description: 'Une session de respiration au bord de l\'eau',
        zone: 'calm',
        type: 'meditation',
        icon: '🏞️',
        duration: 15,
        energyCost: 20,
        rewards: { xp: 50, coins: 15 },
        unlockRequirements: {},
        position: { x: 60, y: 20 },
        isUnlocked: true,
        isCompleted: false,
        completionCount: 0,
        lastVisited: null,
      },
      {
        id: 'calm-garden',
        name: 'Jardin Zen',
        description: 'Méditation guidée parmi les cerisiers',
        zone: 'calm',
        type: 'meditation',
        icon: '🌸',
        duration: 20,
        energyCost: 25,
        rewards: { xp: 60, coins: 20, badge: 'zen-master' },
        unlockRequirements: { level: 3 },
        position: { x: 75, y: 15 },
        isUnlocked: false,
        isCompleted: false,
        completionCount: 0,
        lastVisited: null,
      },
      // Courage Zone
      {
        id: 'courage-arena',
        name: 'Arène des Défis',
        description: 'Affrontez vos peurs dans un environnement sûr',
        zone: 'courage',
        type: 'challenge',
        icon: '🏟️',
        duration: 10,
        energyCost: 30,
        rewards: { xp: 75, coins: 25 },
        unlockRequirements: { level: 2 },
        position: { x: 25, y: 60 },
        isUnlocked: false,
        isCompleted: false,
        completionCount: 0,
        lastVisited: null,
      },
      // Wonder Zone
      {
        id: 'wonder-cave',
        name: 'Grotte des Révélations',
        description: 'Découvrez des aspects cachés de votre personnalité',
        zone: 'wonder',
        type: 'discovery',
        icon: '🕳️',
        duration: 15,
        energyCost: 25,
        rewards: { xp: 55, coins: 18 },
        unlockRequirements: {},
        position: { x: 80, y: 50 },
        isUnlocked: true,
        isCompleted: false,
        completionCount: 0,
        lastVisited: null,
      },
      // Connection Zone
      {
        id: 'connection-plaza',
        name: 'Place des Rencontres',
        description: 'Partagez vos expériences avec la communauté',
        zone: 'connection',
        type: 'social',
        icon: '🏛️',
        duration: 10,
        energyCost: 15,
        rewards: { xp: 40, coins: 12 },
        unlockRequirements: {},
        position: { x: 50, y: 70 },
        isUnlocked: true,
        isCompleted: false,
        completionCount: 0,
        lastVisited: null,
      },
      // Growth Zone
      {
        id: 'growth-library',
        name: 'Bibliothèque de la Sagesse',
        description: 'Apprenez de nouvelles techniques de bien-être',
        zone: 'growth',
        type: 'discovery',
        icon: '📚',
        duration: 20,
        energyCost: 20,
        rewards: { xp: 65, coins: 22 },
        unlockRequirements: { level: 2 },
        position: { x: 40, y: 45 },
        isUnlocked: false,
        isCompleted: false,
        completionCount: 0,
        lastVisited: null,
      },
    ];

    setAttractions(defaultAttractions);
    initializeQuests();
  };

  // Initialize quests
  const initializeQuests = () => {
    const defaultQuests: ParkQuest[] = [
      {
        id: 'quest-first-steps',
        title: 'Premiers pas dans le parc',
        description: 'Découvrez les attractions de base',
        zone: 'joy',
        objectives: [
          { id: 'visit-3', description: 'Visitez 3 attractions', target: 3, current: 0, completed: false },
          { id: 'earn-xp', description: 'Gagnez 50 XP', target: 50, current: 0, completed: false },
        ],
        rewards: { xp: 100, coins: 50, unlockAttraction: 'joy-fountain' },
        isActive: true,
        isCompleted: false,
        progress: 0,
      },
      {
        id: 'quest-calm-explorer',
        title: 'Explorateur de la Sérénité',
        description: 'Maîtrisez les techniques de calme',
        zone: 'calm',
        objectives: [
          { id: 'meditate-30', description: 'Méditez pendant 30 minutes', target: 30, current: 0, completed: false },
          { id: 'visit-calm', description: 'Visitez toutes les attractions du calme', target: 2, current: 0, completed: false },
        ],
        rewards: { xp: 150, coins: 75, badge: 'calm-explorer' },
        isActive: true,
        isCompleted: false,
        progress: 0,
      },
    ];

    setQuests(defaultQuests);
  };

  // Update weather based on mood
  const updateWeather = useCallback(async () => {
    if (!user) {
      setWeather({ type: 'sunny', intensity: 0.7, mood: 75, description: 'Bienvenue dans le parc !' });
      return;
    }

    try {
      const { data: moodData } = await supabase
        .from('mood_entries')
        .select('score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (moodData && moodData.length > 0) {
        const avgMood = moodData.reduce((sum, m) => sum + m.score, 0) / moodData.length;
        
        let weatherType: ParkWeather['type'] = 'sunny';
        let description = '';

        if (avgMood >= 80) {
          weatherType = 'magical';
          description = 'Le parc brille d\'une lumière magique !';
        } else if (avgMood >= 60) {
          weatherType = 'sunny';
          description = 'Une belle journée ensoleillée';
        } else if (avgMood >= 40) {
          weatherType = 'cloudy';
          description = 'Quelques nuages passent...';
        } else if (avgMood >= 20) {
          weatherType = 'rainy';
          description = 'Une pluie douce et apaisante';
        } else {
          weatherType = 'stormy';
          description = 'L\'orage gronde, mais il passera';
        }

        setWeather({
          type: weatherType,
          intensity: avgMood / 100,
          mood: avgMood,
          description,
        });
      }
    } catch {
      // Use default weather
    }
  }, [user]);

  // Visit an attraction
  const visitAttraction = useCallback(async (attractionId: string): Promise<boolean> => {
    const attraction = attractions.find(a => a.id === attractionId);
    if (!attraction) return false;

    if (!attraction.isUnlocked) {
      logger.warn('Attraction not unlocked', { attractionId }, 'PARK');
      return false;
    }

    if (progress.energy < attraction.energyCost) {
      logger.warn('Not enough energy', { required: attraction.energyCost, current: progress.energy }, 'PARK');
      return false;
    }

    // Deduct energy
    setProgress(prev => ({
      ...prev,
      energy: prev.energy - attraction.energyCost,
    }));

    // Navigate to attraction experience
    // This would typically trigger navigation to the actual experience
    logger.info('Visiting attraction', { attractionId, zone: attraction.zone }, 'PARK');
    
    return true;
  }, [attractions, progress.energy]);

  // Complete an attraction
  const completeAttraction = useCallback((attractionId: string) => {
    const attraction = attractions.find(a => a.id === attractionId);
    if (!attraction) return;

    // Update attraction
    setAttractions(prev =>
      prev.map(a =>
        a.id === attractionId
          ? {
              ...a,
              isCompleted: true,
              completionCount: a.completionCount + 1,
              lastVisited: new Date().toISOString(),
            }
          : a
      )
    );

    // Award rewards
    setProgress(prev => {
      const newXp = prev.xp + attraction.rewards.xp;
      const xpNeeded = prev.xpToNextLevel;
      let newLevel = prev.level;
      let remainingXp = newXp;

      // Level up if enough XP
      while (remainingXp >= xpNeeded) {
        remainingXp -= xpNeeded;
        newLevel++;
      }

      const newBadges = attraction.rewards.badge
        ? [...prev.badges, attraction.rewards.badge]
        : prev.badges;

      return {
        ...prev,
        xp: remainingXp,
        xpToNextLevel: newLevel > prev.level ? Math.floor(100 * Math.pow(1.5, newLevel - 1)) : prev.xpToNextLevel,
        level: newLevel,
        coins: prev.coins + attraction.rewards.coins,
        badges: [...new Set(newBadges)],
        attractionsCompleted: prev.attractionsCompleted + (attraction.completionCount === 0 ? 1 : 0),
        totalVisits: prev.totalVisits + 1,
      };
    });

    // Update quest progress
    updateQuestProgress('visit-attraction', 1);
    updateQuestProgress('earn-xp', attraction.rewards.xp);
    if (attraction.type === 'meditation') {
      updateQuestProgress('meditate', attraction.duration);
    }

    // Check for unlocks
    checkUnlocks();

    logger.info('Attraction completed', { attractionId, rewards: attraction.rewards }, 'PARK');
  }, [attractions]);

  // Update quest progress
  const updateQuestProgress = useCallback((objectiveType: string, amount: number) => {
    setQuests(prev =>
      prev.map(quest => {
        if (quest.isCompleted) return quest;

        const updatedObjectives = quest.objectives.map(obj => {
          if (obj.completed) return obj;
          
          const matches =
            (objectiveType === 'visit-attraction' && obj.id.startsWith('visit-')) ||
            (objectiveType === 'earn-xp' && obj.id.startsWith('earn-xp')) ||
            (objectiveType === 'meditate' && obj.id.startsWith('meditate'));

          if (matches) {
            const newCurrent = Math.min(obj.target, obj.current + amount);
            return {
              ...obj,
              current: newCurrent,
              completed: newCurrent >= obj.target,
            };
          }
          return obj;
        });

        const allCompleted = updatedObjectives.every(o => o.completed);
        const progressPercent = Math.round(
          (updatedObjectives.filter(o => o.completed).length / updatedObjectives.length) * 100
        );

        return {
          ...quest,
          objectives: updatedObjectives,
          isCompleted: allCompleted,
          progress: progressPercent,
        };
      })
    );
  }, []);

  // Check for unlocks
  const checkUnlocks = useCallback(() => {
    setAttractions(prev =>
      prev.map(attraction => {
        if (attraction.isUnlocked) return attraction;

        const req = attraction.unlockRequirements;
        const meetsLevel = !req.level || progress.level >= req.level;
        const meetsBadges = !req.badges || req.badges.every(b => progress.badges.includes(b));
        const meetsQuests = !req.questsCompleted || req.questsCompleted.every(q =>
          quests.find(quest => quest.id === q && quest.isCompleted)
        );

        if (meetsLevel && meetsBadges && meetsQuests) {
          logger.info('Attraction unlocked', { attractionId: attraction.id }, 'PARK');
          return { ...attraction, isUnlocked: true };
        }

        return attraction;
      })
    );
  }, [progress.level, progress.badges, quests]);

  // Get attractions by zone
  const getAttractionsByZone = useCallback((zone: EmotionZone) => {
    return attractions.filter(a => a.zone === zone);
  }, [attractions]);

  // Zone stats
  const zoneStats = useMemo(() => {
    const stats: Record<EmotionZone, { total: number; unlocked: number; completed: number }> = {
      joy: { total: 0, unlocked: 0, completed: 0 },
      calm: { total: 0, unlocked: 0, completed: 0 },
      courage: { total: 0, unlocked: 0, completed: 0 },
      wonder: { total: 0, unlocked: 0, completed: 0 },
      connection: { total: 0, unlocked: 0, completed: 0 },
      growth: { total: 0, unlocked: 0, completed: 0 },
    };

    attractions.forEach(a => {
      stats[a.zone].total++;
      if (a.isUnlocked) stats[a.zone].unlocked++;
      if (a.isCompleted) stats[a.zone].completed++;
    });

    return stats;
  }, [attractions]);

  return {
    // State
    attractions,
    quests,
    progress,
    weather,
    isLoading,
    currentZone,
    zones: ZONES,

    // Actions
    visitAttraction,
    completeAttraction,
    setCurrentZone,
    updateWeather,

    // Helpers
    getAttractionsByZone,
    zoneStats,

    // Computed
    activeQuests: quests.filter(q => q.isActive && !q.isCompleted),
    completedQuests: quests.filter(q => q.isCompleted),
    unlockedAttractions: attractions.filter(a => a.isUnlocked),
    energyPercent: (progress.energy / progress.maxEnergy) * 100,
  };
}

export default useEmotionalParkEnriched;
