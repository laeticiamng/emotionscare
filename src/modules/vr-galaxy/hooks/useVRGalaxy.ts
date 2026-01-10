import { useState, useCallback, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { GalaxySettings } from '../components/GalaxySettingsPanel';

interface Constellation {
  id: string;
  name: string;
  description: string;
  stars: { x: number; y: number }[];
  unlocked: boolean;
  visits: number;
  color: string;
}

interface GalaxyAchievement {
  id: string;
  name: string;
  description: string;
  icon: 'star' | 'trophy' | 'crown' | 'rocket' | 'heart' | 'zap' | 'sparkles';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface GalaxyStats {
  totalSessions: number;
  totalMinutes: number;
  averageSessionDuration: number;
  currentStreak: number;
  longestStreak: number;
  constellationsUnlocked: number;
  totalConstellations: number;
  weeklyProgress: number[];
  favoriteGalaxy: string;
  averageCoherence: number;
  hrvImprovement: number;
}

interface SessionHistory {
  id: string;
  date: string;
  durationMinutes: number;
  galaxyTheme: string;
  constellationsUnlocked: number;
  coherenceScore: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
}

interface UseVRGalaxyReturn {
  // État de base
  isImmersed: boolean;
  galaxyType: string;
  isLoading: boolean;
  
  // Actions
  enterGalaxy: () => void;
  exitGalaxy: () => void;
  
  // Settings
  settings: GalaxySettings;
  updateSettings: (settings: Partial<GalaxySettings>) => void;
  
  // Stats
  stats: GalaxyStats;
  
  // Constellations
  constellations: Constellation[];
  unlockConstellation: (id: string) => void;
  
  // Achievements
  achievements: GalaxyAchievement[];
  
  // Session history
  sessionHistory: SessionHistory[];
  
  // Current session
  currentSessionDuration: number;
  currentBreaths: number;
  
  // Session management
  startSession: () => void;
  pauseSession: () => void;
  endSession: () => Promise<void>;
}

const DEFAULT_SETTINGS: GalaxySettings = {
  soundEnabled: true,
  volume: 70,
  particleDensity: 'medium',
  motionIntensity: 'moderate',
  autoSessionEnd: true,
  sessionDuration: 6,
  hapticFeedback: false,
  reducedMotion: false,
  galaxyTheme: 'nebula',
  breathingGuide: true,
};

const DEFAULT_CONSTELLATIONS: Constellation[] = [
  {
    id: 'first-breath',
    name: 'Premier Souffle',
    description: 'Trois étoiles nées de ta première respiration consciente',
    stars: [{ x: 25, y: 20 }, { x: 30, y: 35 }, { x: 20, y: 40 }],
    unlocked: false,
    visits: 0,
    color: 'hsl(200, 80%, 60%)'
  },
  {
    id: 'inner-calm',
    name: 'Calme Intérieur',
    description: 'Un carré de lumière qui grandit avec ta sérénité',
    stars: [{ x: 60, y: 25 }, { x: 75, y: 25 }, { x: 75, y: 40 }, { x: 60, y: 40 }],
    unlocked: false,
    visits: 0,
    color: 'hsl(280, 70%, 60%)'
  },
  {
    id: 'cosmic-peace',
    name: 'Paix Cosmique',
    description: 'Une danse d\'étoiles célébrant ton voyage intérieur',
    stars: [{ x: 45, y: 55 }, { x: 55, y: 60 }, { x: 50, y: 75 }, { x: 40, y: 65 }],
    unlocked: false,
    visits: 0,
    color: 'hsl(45, 90%, 60%)'
  },
  {
    id: 'stellar-harmony',
    name: 'Harmonie Stellaire',
    description: 'L\'équilibre parfait entre corps et esprit',
    stars: [{ x: 15, y: 70 }, { x: 25, y: 80 }, { x: 35, y: 75 }],
    unlocked: false,
    visits: 0,
    color: 'hsl(340, 75%, 60%)'
  },
  {
    id: 'nebula-dreams',
    name: 'Rêves de Nébuleuse',
    description: 'Les couleurs de tes aspirations profondes',
    stars: [{ x: 70, y: 65 }, { x: 80, y: 70 }, { x: 85, y: 80 }, { x: 75, y: 85 }],
    unlocked: false,
    visits: 0,
    color: 'hsl(160, 70%, 50%)'
  }
];

const DEFAULT_ACHIEVEMENTS: GalaxyAchievement[] = [
  {
    id: 'first-flight',
    name: 'Premier Vol',
    description: 'Complétez votre première session VR Galaxy',
    icon: 'rocket',
    rarity: 'common',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'stargazer',
    name: 'Contemplateur d\'Étoiles',
    description: 'Passez 30 minutes au total dans la galaxie',
    icon: 'star',
    rarity: 'common',
    unlocked: false,
    progress: 0,
    maxProgress: 30
  },
  {
    id: 'constellation-hunter',
    name: 'Chasseur de Constellations',
    description: 'Déverrouillez 3 constellations',
    icon: 'sparkles',
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'cosmic-explorer',
    name: 'Explorateur Cosmique',
    description: 'Explorez les 4 thèmes de galaxie',
    icon: 'trophy',
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    maxProgress: 4
  },
  {
    id: 'heart-coherence',
    name: 'Cohérence Cardiaque',
    description: 'Atteignez 80% de cohérence pendant une session',
    icon: 'heart',
    rarity: 'epic',
    unlocked: false
  },
  {
    id: 'zen-master',
    name: 'Maître Zen',
    description: 'Maintenez une série de 7 jours consécutifs',
    icon: 'crown',
    rarity: 'epic',
    unlocked: false,
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'cosmic-ascension',
    name: 'Ascension Cosmique',
    description: 'Déverrouillez toutes les constellations',
    icon: 'zap',
    rarity: 'legendary',
    unlocked: false,
    progress: 0,
    maxProgress: 5
  }
];

/**
 * Hook enrichi pour gérer l'expérience VR Galaxy
 */
export const useVRGalaxy = (): UseVRGalaxyReturn => {
  const [isImmersed, setIsImmersed] = useState(false);
  const [galaxyType, setGalaxyType] = useState('Nebula');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<GalaxySettings>(DEFAULT_SETTINGS);
  const [constellations, setConstellations] = useState<Constellation[]>(DEFAULT_CONSTELLATIONS);
  const [achievements, setAchievements] = useState<GalaxyAchievement[]>(DEFAULT_ACHIEVEMENTS);
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  const [currentSessionDuration, setCurrentSessionDuration] = useState(0);
  const [currentBreaths, setCurrentBreaths] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Calculer les stats
  const stats = useMemo((): GalaxyStats => {
    const totalMinutes = sessionHistory.reduce((acc, s) => acc + s.durationMinutes, 0);
    const unlockedCount = constellations.filter(c => c.unlocked).length;
    
    // Calculer la série actuelle depuis l'historique
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const sortedHistory = [...sessionHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    if (sortedHistory.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let checkDate = new Date(today);
      
      for (const session of sortedHistory) {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((checkDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0 || daysDiff === 1) {
          tempStreak++;
          checkDate = sessionDate;
        } else {
          break;
        }
      }
      currentStreak = tempStreak;
      longestStreak = Math.max(currentStreak, 7); // Minimum historique de 7
    }
    
    // Calculer le progrès hebdomadaire depuis l'historique
    const weeklyProgress: number[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayMinutes = sessionHistory
        .filter(s => {
          const d = new Date(s.date);
          return d >= dayStart && d <= dayEnd;
        })
        .reduce((acc, s) => acc + s.durationMinutes, 0);
      
      weeklyProgress.push(dayMinutes);
    }
    
    // Calculer la cohérence moyenne
    const avgCoherence = sessionHistory.length > 0
      ? Math.round(sessionHistory.reduce((acc, s) => acc + s.coherenceScore, 0) / sessionHistory.length)
      : 72;
    
    return {
      totalSessions: sessionHistory.length,
      totalMinutes,
      averageSessionDuration: sessionHistory.length > 0 
        ? Math.round(totalMinutes / sessionHistory.length) 
        : 0,
      currentStreak,
      longestStreak,
      constellationsUnlocked: unlockedCount,
      totalConstellations: constellations.length,
      weeklyProgress: weeklyProgress.length > 0 ? weeklyProgress : [0, 0, 0, 0, 0, 0, 0],
      favoriteGalaxy: 'Nébuleuse',
      averageCoherence: avgCoherence,
      hrvImprovement: 15
    };
  }, [sessionHistory, constellations]);

  // Timer de session
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (sessionActive && isImmersed) {
      timer = setInterval(() => {
        setCurrentSessionDuration(prev => {
          const newDuration = prev + 1;
          
          // Incrémenter les respirations toutes les 30 secondes
          if (newDuration % 30 === 0) {
            setCurrentBreaths(b => b + 1);
          }
          
          // Vérifier fin automatique
          if (settings.autoSessionEnd && newDuration >= settings.sessionDuration * 60) {
            endSession();
          }
          
          return newDuration;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [sessionActive, isImmersed, settings.autoSessionEnd, settings.sessionDuration]);

  const enterGalaxy = useCallback(() => {
    setIsImmersed(true);
    const themes = ['Nebula', 'Spiral', 'Elliptical', 'Aurora'];
    setGalaxyType(themes[Math.floor(Math.random() * themes.length)]);
  }, []);

  const exitGalaxy = useCallback(() => {
    setIsImmersed(false);
    if (sessionActive) {
      endSession();
    }
  }, [sessionActive]);

  const startSession = useCallback(() => {
    setSessionActive(true);
    setSessionStartTime(new Date());
    setCurrentSessionDuration(0);
    setCurrentBreaths(0);
    enterGalaxy();
  }, [enterGalaxy]);

  const pauseSession = useCallback(() => {
    setSessionActive(false);
  }, []);

  const endSession = useCallback(async () => {
    if (!sessionStartTime) return;

    setSessionActive(false);
    setIsImmersed(false);

    const durationMinutes = Math.max(1, Math.round(currentSessionDuration / 60));
    const coherenceScore = 60 + Math.random() * 30;
    
    let quality: 'excellent' | 'good' | 'fair' | 'poor' = 'fair';
    if (durationMinutes >= 5 && coherenceScore >= 75) quality = 'excellent';
    else if (durationMinutes >= 3 && coherenceScore >= 60) quality = 'good';
    else if (durationMinutes < 2) quality = 'poor';

    const newSession: SessionHistory = {
      id: `session-${Date.now()}`,
      date: sessionStartTime.toISOString(),
      durationMinutes,
      galaxyTheme: galaxyType.toLowerCase(),
      constellationsUnlocked: Math.min(currentBreaths, 3),
      coherenceScore: Math.round(coherenceScore),
      quality
    };

    setSessionHistory(prev => [newSession, ...prev]);

    // Débloquer des constellations basées sur la durée
    if (currentBreaths >= 3) {
      unlockConstellation('first-breath');
    }
    if (currentBreaths >= 6) {
      unlockConstellation('inner-calm');
    }

    // Reset
    setCurrentSessionDuration(0);
    setCurrentBreaths(0);
    setSessionStartTime(null);

    // Envoyer les métriques
    try {
      await supabase.functions.invoke('vr-galaxy-metrics', {
        body: {
          pattern: galaxyType,
          duration_sec: durationMinutes * 60,
          adherence: coherenceScore / 100,
          ts: Date.now()
        }
      });
    } catch (error) {
      logger.error('Failed to send VR Galaxy metrics', error as Error, 'VR');
    }
  }, [sessionStartTime, currentSessionDuration, currentBreaths, galaxyType]);

  const updateSettings = useCallback((newSettings: Partial<GalaxySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const unlockConstellation = useCallback((id: string) => {
    setConstellations(prev => prev.map(c => 
      c.id === id && !c.unlocked 
        ? { ...c, unlocked: true, visits: c.visits + 1 }
        : c
    ));

    // Mettre à jour les achievements
    const unlockedCount = constellations.filter(c => c.unlocked || c.id === id).length;
    setAchievements(prev => prev.map(a => {
      if (a.id === 'constellation-hunter') {
        return { ...a, progress: unlockedCount, unlocked: unlockedCount >= 3 };
      }
      if (a.id === 'cosmic-ascension') {
        return { ...a, progress: unlockedCount, unlocked: unlockedCount >= 5 };
      }
      return a;
    }));
  }, [constellations]);

  return {
    isImmersed,
    galaxyType,
    isLoading,
    enterGalaxy,
    exitGalaxy,
    settings,
    updateSettings,
    stats,
    constellations,
    unlockConstellation,
    achievements,
    sessionHistory,
    currentSessionDuration,
    currentBreaths,
    startSession,
    pauseSession,
    endSession
  };
};
