import { useState, useEffect } from 'react';
import { Challenge, LeaderboardEntry } from '@/types/gamification';
import { Badge } from '@/types/badge';
import { normalizeChallenge } from '@/utils/challengeUtils';
import { normalizeBadge } from '@/utils/badgeUtils';

export function useGamification() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchGamificationData = async () => {
      try {
        // Wait a bit to simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data
        const mockBadges = [
          normalizeBadge({
            id: 'badge1',
            name: 'First Steps',
            description: 'Complete your first profile',
            imageUrl: '/badges/badge-1.svg',
            unlocked: true,
            level: 1,
            category: 'onboarding',
            tier: 'bronze'
          }),
          normalizeBadge({
            id: 'badge2',
            name: 'Emotion Master',
            description: 'Track 10 different emotions',
            imageUrl: '/badges/badge-2.svg',
            unlocked: false,
            level: 2,
            category: 'emotion',
            tier: 'silver'
          }),
          normalizeBadge({
            id: 'badge3',
            name: 'Consistent User',
            description: 'Use the app for 7 consecutive days',
            imageUrl: '/badges/badge-3.svg',
            unlocked: false,
            level: 3,
            category: 'activity',
            tier: 'gold'
          })
        ];

        // Mock challenge data using the normalizeChallenge utility
        const mockChallenges = [
          normalizeChallenge({
            id: 'challenge1',
            title: 'Daily Check-in',
            name: 'Daily Check-in',
            description: 'Log your emotions once per day',
            points: 50,
            progress: 3,
            goal: 7,
            category: 'daily',
            completed: false,
            status: 'active',
            difficulty: 'easy',
            completions: 3,
            total: 7
          }),
          normalizeChallenge({
            id: 'challenge2',
            title: 'Emotion Explorer',
            name: 'Emotion Explorer',
            description: 'Track 5 different emotions in a week',
            points: 100,
            progress: 2,
            goal: 5,
            category: 'weekly',
            completed: false,
            status: 'active',
            difficulty: 'medium',
            completions: 2,
            total: 5
          }),
          normalizeChallenge({
            id: 'challenge3',
            title: 'Meditation Master',
            name: 'Meditation Master',
            description: 'Complete 10 meditation sessions',
            points: 200,
            progress: 4,
            goal: 10,
            category: 'monthly',
            completed: false,
            status: 'active',
            difficulty: 'hard',
            completions: 4,
            total: 10
          })
        ];

        // Mock leaderboard
        const mockLeaderboard = [
          {
            id: 'user1',
            userId: 'user1',
            username: 'EmotionExplorer',
            points: 1250,
            position: 1,
            avatarUrl: '/avatars/avatar1.png',
            rank: 1,
            level: 10,
            progress: 75
          },
          {
            id: 'user2',
            userId: 'user2',
            username: 'MindfulMaster',
            points: 980,
            position: 2,
            avatarUrl: '/avatars/avatar2.png',
            rank: 2,
            level: 8,
            progress: 50
          },
          {
            id: 'user3',
            userId: 'user3',
            username: 'JoyfulJourney',
            points: 750,
            position: 3,
            avatarUrl: '/avatars/avatar3.png',
            rank: 3,
            level: 6,
            progress: 25
          }
        ];

        setBadges(mockBadges);
        setChallenges(mockChallenges);
        setLeaderboard(mockLeaderboard);
        setPoints(850);
        setLevel(7);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gamification data:', error);
        setLoading(false);
      }
    };

    fetchGamificationData();
  }, []);

  // Fonction pour débloquer un badge
  const unlockBadge = async (badgeId: string): Promise<boolean> => {
    try {
      // Dans une implémentation réelle, cela appellerait une API
      await new Promise(resolve => setTimeout(resolve, 300)); // Simuler un délai réseau
      
      setBadges(prevBadges => 
        prevBadges.map(badge => 
          badge.id === badgeId 
            ? { ...badge, unlocked: true, completed: true, progress: badge.threshold || 100 } 
            : badge
        )
      );
      
      return true;
    } catch (error) {
      console.error("Erreur lors du déblocage du badge:", error);
      return false;
    }
  };

  // Fonction pour mettre à jour la progression d'un défi
  const updateChallengeProgress = async (challengeId: string, newProgress: number): Promise<boolean> => {
    try {
      // Dans une implémentation réelle, cela appellerait une API
      await new Promise(resolve => setTimeout(resolve, 300)); // Simuler un délai réseau
      
      setChallenges(prevChallenges => 
        prevChallenges.map(challenge => {
          if (challenge.id !== challengeId) return challenge;
          
          const progress = Math.min(newProgress, challenge.goal);
          const completed = progress >= challenge.goal;
          
          return {
            ...challenge,
            progress,
            completed,
            status: completed ? "completed" : "in-progress",
            completions: progress
          };
        })
      );
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du défi:", error);
      return false;
    }
  };

  return {
    badges,
    challenges,
    leaderboard,
    points,
    level,
    loading,
    unlockBadge,
    updateChallengeProgress
  };
}

export default useGamification;
