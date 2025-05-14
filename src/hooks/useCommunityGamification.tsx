
import { useState, useEffect } from 'react';
import { mockBadges, mockChallenges, mockLeaderboard, mockGamificationStats } from './community-gamification/mockData';

// Define the return type for clarity
interface CommunityGamificationState {
  badges: any[];
  challenges: any[];
  leaderboard: any[];
  stats: {
    level: number;
    points: number;
    badgesCount: number;
    streak: number;
    nextLevelPoints: number;
    recentAchievements: any[];
  };
  loading: boolean;
  error: string | null;
}

export const useCommunityGamification = () => {
  const [state, setState] = useState<CommunityGamificationState>({
    badges: [],
    challenges: [],
    leaderboard: [],
    stats: {
      level: 1,
      points: 0,
      badgesCount: 0,
      streak: 0,
      nextLevelPoints: 100,
      recentAchievements: []
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setState({
          badges: mockBadges,
          challenges: mockChallenges,
          leaderboard: mockLeaderboard,
          stats: {
            level: mockGamificationStats.level,
            points: mockGamificationStats.points,
            badgesCount: mockGamificationStats.badges,
            streak: mockGamificationStats.streak,
            nextLevelPoints: mockGamificationStats.nextLevelPoints,
            recentAchievements: mockGamificationStats.recentAchievements
          },
          loading: false,
          error: null
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load gamification data'
        }));
      }
    };

    fetchData();
  }, []);

  const completeChallenge = async (id: string) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setState(prev => ({
        ...prev,
        challenges: prev.challenges.map(challenge => 
          challenge.id === id 
            ? { ...challenge, status: 'completed', progress: challenge.target } 
            : challenge
        ),
        stats: {
          ...prev.stats,
          points: prev.stats.points + (prev.challenges.find(c => c.id === id)?.points || 0)
        }
      }));

      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    ...state,
    completeChallenge
  };
};

export default useCommunityGamification;
