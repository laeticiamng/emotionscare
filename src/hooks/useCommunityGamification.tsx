
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/types/badge';
import { Challenge, LeaderboardEntry } from '@/types/gamification';

export function useCommunityGamification() {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  
  // Mock data for badges
  const badges: Badge[] = [
    {
      id: "badge1",
      name: "Emotional Intelligence",
      description: "Demonstrated exceptional emotional awareness and intelligence",
      imageUrl: "/images/badges/ei-badge.png",
      level: 2,
      unlocked: true,
      unlockedAt: new Date().toISOString(),
      category: "emotional",
      rarity: "rare",
      tier: "gold",
      progress: 100,
      threshold: 100,
      completed: true
    },
    {
      id: "badge2",
      name: "Meditation Master",
      description: "Completed 10 meditation sessions",
      imageUrl: "/images/badges/meditation-badge.png",
      level: 1,
      unlocked: true,
      unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      category: "wellness",
      rarity: "common",
      tier: "silver",
      progress: 10,
      threshold: 10,
      completed: true
    },
    {
      id: "badge3",
      name: "Social Butterfly",
      description: "Connected with 5 team members",
      imageUrl: "/images/badges/social-badge.png",
      level: 3,
      unlocked: false,
      category: "social",
      rarity: "epic",
      tier: "platinum",
      progress: 3,
      threshold: 5,
      completed: false
    }
  ];
  
  // Mock challenges data
  const challenges: Challenge[] = [
    {
      id: "challenge1",
      title: "Daily Reflection",
      name: "Daily Reflection",
      description: "Complete a daily reflection for 5 consecutive days",
      progress: 3,
      goal: 5,
      completed: false,
      category: "wellness",
      status: "in-progress",
      difficulty: "easy",
      points: 50,
      totalSteps: 5,
      icon: "calendar",
      reward: "badge123",
      unlocked: true
    },
    {
      id: "challenge2",
      title: "Team Connection",
      name: "Team Connection",
      description: "Share emotions with 3 team members",
      progress: 2,
      goal: 3,
      completed: false,
      category: "social",
      status: "in-progress",
      difficulty: "medium",
      points: 75,
      totalSteps: 3,
      icon: "users",
      reward: "badge456",
      unlocked: true
    }
  ];
  
  // Mock leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    {
      id: "user1",
      userId: "user1",
      username: "JohnDoe",
      points: 1250,
      rank: 1,
      badges: 8,
      streak: 12,
      avatarUrl: "/images/avatars/avatar1.png"
    },
    {
      id: "user2",
      userId: "user2",
      username: "JaneSmith",
      points: 1100,
      rank: 2,
      badges: 7,
      streak: 8,
      avatarUrl: "/images/avatars/avatar2.png"
    },
    {
      id: "user3",
      userId: "user3",
      username: "MikeJohnson",
      points: 950,
      rank: 3,
      badges: 6,
      streak: 5,
      avatarUrl: "/images/avatars/avatar3.png"
    }
  ];
  
  const { data: gamificationStats } = useQuery({
    queryKey: ['gamification', 'stats'],
    queryFn: () => {
      // Mock API call
      return Promise.resolve({
        points: 750,
        level: 3,
        rank: "Explorer",
        streakDays: 7,
        badges: 5,
        streak: 7,
        nextLevelPoints: 1000,
        progress: 75,
        completedChallenges: 8,
        totalChallenges: 15,
      });
    }
  });
  
  const { data: badgesData } = useQuery({
    queryKey: ['gamification', 'badges'],
    queryFn: () => {
      // Mock API call
      return Promise.resolve(badges);
    }
  });
  
  const { data: challengesData } = useQuery({
    queryKey: ['gamification', 'challenges'],
    queryFn: () => {
      // Mock API call
      return Promise.resolve(challenges);
    }
  });
  
  const { data: leaderboardData } = useQuery({
    queryKey: ['gamification', 'leaderboard'],
    queryFn: () => {
      // Mock API call
      return Promise.resolve(leaderboard);
    }
  });
  
  const startChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      setCurrentChallenge(challenge);
      return Promise.resolve(challenge);
    }
    return Promise.reject("Challenge not found");
  };
  
  const updateChallengeProgress = (challengeId: string, progress: number) => {
    // In a real app, this would update the progress via an API call
    return Promise.resolve({ success: true, progress });
  };
  
  return {
    badges: badgesData || [],
    challenges: challengesData || [],
    leaderboard: leaderboardData || [],
    currentChallenge,
    stats: gamificationStats,
    startChallenge,
    updateChallengeProgress,
    isLoading: false
  };
}

export default useCommunityGamification;
