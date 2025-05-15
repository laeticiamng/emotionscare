
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge, Challenge, GamificationStats, LeaderboardEntry } from '@/types/gamification';

export function useCommunityGamification() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [gamificationData, setGamificationData] = useState<GamificationStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGamificationData() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API call to fetch gamification data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for demonstration
        const mockBadges: Badge[] = [
          {
            id: '1',
            name: 'Explorateur émotionnel',
            description: 'A complété 5 scans émotionnels',
            image_url: '',
            tier: 'bronze',
            icon: 'search'
          },
          {
            id: '2',
            name: 'Journaliste en herbe',
            description: 'A écrit 10 entrées de journal',
            image_url: '',
            tier: 'silver',
            icon: 'book'
          },
        ];
        
        const mockChallenges: Challenge[] = [
          {
            id: '1',
            title: 'Semaine de pleine conscience',
            description: 'Compléter 7 jours de méditation',
            points: 50,
            completed: true,
            progress: 100,
            totalSteps: 7,
            difficulty: 'medium',
            completions: 45
          },
          {
            id: '2',
            title: 'Explorer ses émotions',
            description: 'Réaliser 5 scans émotionnels',
            points: 30,
            completed: false,
            progress: 3,
            totalSteps: 5,
            difficulty: 'easy',
            completions: 120
          },
          {
            id: '3',
            title: 'Journal quotidien',
            description: 'Tenir un journal pendant 14 jours',
            points: 100,
            completed: false,
            progress: 5,
            totalSteps: 14,
            difficulty: 'hard',
            completions: 32
          }
        ];
        
        const mockLeaderboard: LeaderboardEntry[] = [
          { id: '1', name: 'Sophie M.', avatar: '', points: 1250, rank: 1, trend: 'stable', badges: 15, level: 8 },
          { id: '2', name: 'Thomas R.', avatar: '', points: 1120, rank: 2, trend: 'up', badges: 12, level: 7 },
          { id: '3', name: 'Emma L.', avatar: '', points: 980, rank: 3, trend: 'down', badges: 10, level: 6 },
        ];
        
        const mockTopChallenges: (Challenge & { name: string; completions: number; })[] = [
          {
            id: '1',
            name: 'Scan quotidien',
            description: 'Faire un scan émotionnel chaque jour',
            points: 10,
            completed: false,
            completions: 450
          },
          {
            id: '2',
            name: 'Journal hebdomadaire',
            description: 'Écrire dans le journal une fois par semaine',
            points: 25,
            completed: false,
            completions: 320
          },
          {
            id: '3',
            name: 'Méditation guidée',
            description: 'Suivre une séance de méditation guidée',
            points: 15,
            completed: false,
            completions: 280
          }
        ];
        
        // Complete mock data
        const mockData: GamificationStats = {
          points: 750,
          level: 5,
          badges: mockBadges,
          streak: 7,
          completedChallenges: 12,
          totalChallenges: 25,
          activeUsersPercent: 78,
          totalBadges: 45,
          badgeLevels: [
            { level: 'Bronze', count: 25 },
            { level: 'Silver', count: 15 },
            { level: 'Gold', count: 5 }
          ],
          topChallenges: mockTopChallenges,
          completionRate: 68,
          rewardsEarned: 15,
          userEngagement: 82,
          progress: 65,
          challenges: mockChallenges,
          achievements: mockBadges,
          leaderboard: mockLeaderboard,
          nextLevelPoints: 250,
          lastActivityDate: new Date().toISOString()
        };
        
        setGamificationData(mockData);
      } catch (err) {
        console.error('Error fetching gamification data:', err);
        setError('Failed to load gamification data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchGamificationData();
  }, [user]);

  return { gamificationData, isLoading, error };
}

export default useCommunityGamification;
