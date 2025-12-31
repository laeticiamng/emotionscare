/**
 * Gamification Provider - Context pour les notifications d'achievements
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AchievementToast } from './AchievementToast';
import { useGamification } from '@/modules/gamification';

interface UnlockedAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}

interface GamificationContextValue {
  showAchievement: (achievement: UnlockedAchievement) => void;
  trackActivity: (type: string, metadata?: Record<string, unknown>) => void;
}

const GamificationContext = createContext<GamificationContextValue | null>(null);

export const useGamificationContext = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamificationContext must be used within GamificationProvider');
  }
  return context;
};

interface GamificationProviderProps {
  children: React.ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
  const [currentAchievement, setCurrentAchievement] = useState<UnlockedAchievement | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<UnlockedAchievement[]>([]);
  const { trackActivity: trackGamificationActivity, achievements } = useGamification();

  // Track previously unlocked achievements to detect new ones
  const [previouslyUnlocked, setPreviouslyUnlocked] = useState<Set<string>>(new Set());

  // Detect newly unlocked achievements
  useEffect(() => {
    const currentUnlocked = new Set(
      achievements.filter(a => a.unlocked).map(a => a.id)
    );

    // Find newly unlocked
    currentUnlocked.forEach(id => {
      if (!previouslyUnlocked.has(id)) {
        const achievement = achievements.find(a => a.id === id);
        if (achievement && previouslyUnlocked.size > 0) {
          // Don't trigger on initial load
          showAchievement({
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            rarity: achievement.rarity as 'common' | 'rare' | 'epic' | 'legendary',
            xpReward: achievement.xpReward,
          });
        }
      }
    });

    setPreviouslyUnlocked(currentUnlocked);
  }, [achievements]);

  // Process achievement queue
  useEffect(() => {
    if (!currentAchievement && achievementQueue.length > 0) {
      const [next, ...rest] = achievementQueue;
      setCurrentAchievement(next);
      setAchievementQueue(rest);
    }
  }, [currentAchievement, achievementQueue]);

  const showAchievement = useCallback((achievement: UnlockedAchievement) => {
    if (currentAchievement) {
      setAchievementQueue(prev => [...prev, achievement]);
    } else {
      setCurrentAchievement(achievement);
    }
  }, [currentAchievement]);

  const handleCloseAchievement = useCallback(() => {
    setCurrentAchievement(null);
  }, []);

  const trackActivity = useCallback((type: string, metadata?: Record<string, unknown>) => {
    trackGamificationActivity(type, metadata);
  }, [trackGamificationActivity]);

  return (
    <GamificationContext.Provider value={{ showAchievement, trackActivity }}>
      {children}
      <AchievementToast
        achievement={currentAchievement}
        onClose={handleCloseAchievement}
      />
    </GamificationContext.Provider>
  );
};

export default GamificationProvider;
