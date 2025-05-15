
import { useState, useEffect } from 'react';
import { Badge, Challenge, GamificationStats, LeaderboardEntry } from '@/types';
import { mockBadges, mockLeaderboard } from './community-gamification/mockData';

// Define mockChallenges since it's needed
const mockChallenges: Challenge[] = [
  {
    id: '1',
    name: 'Journal Quotidien',
    description: 'Écrivez dans votre journal pendant 5 jours consécutifs',
    points: 50,
    progress: 3,
    total: 5,
    completed: false
  },
  {
    id: '2',
    name: 'Méditation Matinale',
    description: 'Pratiquez la méditation pendant 10 minutes chaque jour',
    points: 100,
    progress: 7,
    total: 10,
    completed: false
  },
  {
    id: '3',
    name: 'Partage d\'Expérience',
    description: 'Partagez une expérience positive avec la communauté',
    points: 75,
    progress: 1,
    total: 1,
    completed: true
  }
];

interface UseCommunityGamificationReturn {
  stats: GamificationStats;
  badges: Badge[];
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
}

export const useCommunityGamification = (): UseCommunityGamificationReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock initial stats
  const [stats, setStats] = useState<GamificationStats>({
    points: 850,
    level: 3,
    badges: mockBadges,
    streak: 5,
    rank: '42',
    nextLevelPoints: 150,
    progressToNextLevel: 70,
    completedChallenges: 4,
    totalChallenges: 10,
    activeChallenges: 3,
    recentAchievements: mockBadges.slice(0, 1),
    challenges: mockChallenges,
    // Add the missing properties for AdminTabContents
    activeUsersPercent: 78,
    totalBadges: 25,
    badgeLevels: [
      { level: 'Bronze', count: 12 },
      { level: 'Silver', count: 8 },
      { level: 'Gold', count: 5 }
    ],
    topChallenges: [
      { name: 'Méditation Quotidienne', completions: 142 },
      { name: 'Journal Émotionnel', completions: 98 },
      { name: 'Soutien Communautaire', completions: 76 }
    ]
  });
  
  // Load data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));
        
        // Data already loaded in initial state, no need to update
      } catch (err) {
        setError('Failed to load gamification data');
        console.error('Error loading gamification data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return {
    stats,
    badges: mockBadges,
    challenges: mockChallenges,
    leaderboard: mockLeaderboard,
    isLoading,
    error
  };
};

export default useCommunityGamification;
