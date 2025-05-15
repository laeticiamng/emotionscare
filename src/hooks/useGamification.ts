
import { useState, useEffect, useCallback } from 'react';
import { Badge, Challenge, GamificationStats } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export function useGamification(userId?: string) {
  const [stats, setStats] = useState<GamificationStats>({
    points: 0,
    level: 1,
    badges: [],
    completedChallenges: 0,
    totalChallenges: 0,
    streak: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGamificationStats = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would fetch from backend
      // For now, using mock data
      const mockStats: GamificationStats = {
        points: 2350,
        level: 5,
        rank: "Explorer",
        badges: getMockBadges(),
        completedChallenges: 8,
        totalChallenges: 15,
        streak: 7,
        nextLevel: 6,
        pointsToNextLevel: 650,
        nextLevelPoints: 3000,
        challenges: getMockChallenges(),
        totalPoints: 2350,
        currentLevel: 5,
        progressToNextLevel: 70,
        streakDays: 7,
        lastActivityDate: new Date().toISOString(),
        activeChallenges: 3,
        badgesCount: 8,
        recentAchievements: [],
        leaderboard: []
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats(mockStats);
    } catch (err) {
      console.error('Error fetching gamification stats:', err);
      setError('Failed to load gamification data');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Fetch stats on component mount or userId change
  useEffect(() => {
    fetchGamificationStats();
  }, [fetchGamificationStats]);

  const completeChallenge = useCallback(async (challengeId: string) => {
    if (!userId) return false;
    
    try {
      // In a real app, this would call the backend API
      console.log(`Completing challenge ${challengeId} for user ${userId}`);
      
      // Optimistically update UI
      setStats(prev => {
        const updatedChallenges = prev.challenges?.map(c => 
          c.id === challengeId 
            ? { ...c, status: 'completed' as const, completed: true } 
            : c
        ) || [];
        
        return {
          ...prev,
          points: prev.points + 100,
          completedChallenges: prev.completedChallenges + 1,
          challenges: updatedChallenges
        };
      });
      
      return true;
    } catch (err) {
      console.error('Error completing challenge:', err);
      return false;
    }
  }, [userId]);

  // Mock data helpers
  const getMockBadges = (): Badge[] => {
    return [
      {
        id: "badge1",
        name: "First Scan",
        description: "Complete your first emotion scan",
        icon: "award",
        type: "achievement",
        level: "bronze"
      },
      {
        id: "badge2",
        name: "Week Streak",
        description: "Log in for 7 consecutive days",
        icon: "calendar",
        type: "streak",
        level: "silver"
      },
      {
        id: "badge3",
        name: "Journal Master",
        description: "Write 10 journal entries",
        icon: "book",
        type: "achievement",
        level: "gold"
      }
    ];
  };
  
  const getMockChallenges = (): Challenge[] => {
    return [
      {
        id: "c1",
        name: "Daily Check-in",
        description: "Log in to the app today",
        points: 10,
        type: "daily",
        category: "activity",
        status: "completed",
        completed: true,
        completions: 1,
        total: 1
      },
      {
        id: "c2",
        name: "Emotion Explorer",
        description: "Complete 3 emotion scans this week",
        points: 50,
        type: "weekly",
        category: "emotion",
        status: "in-progress",
        progress: 1,
        total: 3,
        completions: 1
      },
      {
        id: "c3",
        name: "Mindfulness Streak",
        description: "Complete a VR session 3 days in a row",
        points: 100,
        type: "streak",
        category: "activity",
        status: "not-started",
        progress: 0,
        total: 3,
        completions: 0
      },
      {
        id: "c4",
        name: "Share an insight",
        description: "Share an emotional insight with your team",
        points: 30,
        type: "one-time",
        category: "community",
        status: "not-started",
        completions: 0,
        total: 1
      },
      {
        id: "c5",
        name: "Journal Journey",
        description: "Write 5 journal entries",
        points: 75,
        type: "count",
        category: "journal",
        status: "in-progress",
        progress: 2,
        total: 5,
        completions: 2
      }
    ];
  };

  return {
    stats,
    isLoading,
    error,
    fetchGamificationStats,
    completeChallenge
  };
}

export default useGamification;
