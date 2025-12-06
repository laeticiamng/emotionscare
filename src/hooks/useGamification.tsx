
import { useState, useEffect } from 'react';
import { Challenge, Badge, GamificationStats, UseGamificationReturn } from '@/types';

// Mock data for badges
const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Premier pas',
    description: 'Terminez votre première session de VR',
    imageUrl: '/images/badges/first-steps.png',
    level: 'bronze'
  },
  {
    id: '2',
    name: 'Explorateur émotionnel',
    description: 'Identifiez 5 émotions différentes',
    imageUrl: '/images/badges/emotion-explorer.png',
    level: 'silver'
  },
  {
    id: '3',
    name: 'Journal assidu',
    description: 'Écrivez 10 entrées de journal',
    imageUrl: '/images/badges/journal-master.png',
    level: 'gold'
  }
];

// Mock data for challenges
const mockChallenges: Challenge[] = [
  {
    id: '1',
    name: 'Scan quotidien',
    title: 'Scan quotidien',
    description: 'Effectuer un scan émotionnel tous les jours pendant une semaine',
    points: 50,
    type: 'daily',
    category: 'emotion',
    progress: 3,
    total: 7,
    status: 'in-progress',
    icon: 'activity'
  },
  {
    id: '2',
    name: 'Journal thérapeutique',
    title: 'Journal thérapeutique',
    description: 'Écrire 3 entrées de journal cette semaine',
    points: 30,
    type: 'weekly',
    category: 'journal',
    progress: 1,
    total: 3,
    status: 'in-progress',
    icon: 'book'
  },
  {
    id: '3',
    name: 'Immersion complète',
    title: 'Immersion complète',
    description: 'Terminez une session VR de 15 minutes',
    points: 70,
    type: 'one-time',
    category: 'vr',
    status: 'not-started',
    icon: 'eye'
  }
];

// Mock stats
const mockStats: GamificationStats = {
  points: 280,
  level: 3,
  badges: mockBadges,
  completedChallenges: 5,
  totalChallenges: 12,
  streak: 4,
  nextLevel: 4,
  pointsToNextLevel: 120,
  progressToNextLevel: 65,
  totalPoints: 280,
  currentLevel: 3,
  nextLevelPoints: 500,
  challenges: mockChallenges,
  activeChallenges: 2,
  badgesCount: 3,
  rank: 'Explorer',
  streakDays: 4,
  lastActivityDate: new Date().toISOString()
};

export function useGamification(): UseGamificationReturn {
  const [badges, setBadges] = useState<Badge[]>(mockBadges);
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [stats, setStats] = useState<GamificationStats>(mockStats);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API delay
    const timer = setTimeout(() => {
      setBadges(mockBadges);
      setChallenges(mockChallenges);
      setStats(mockStats);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Complete a challenge
  const completeChallenge = (challengeId: string) => {
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === challengeId
          ? { ...challenge, status: 'completed' as const, completed: true, progress: challenge.total }
          : challenge
      )
    );

    // Update stats
    setStats((prev) => ({
      ...prev,
      points: prev.points + 50,
      completedChallenges: prev.completedChallenges + 1,
      activeChallenges: prev.activeChallenges - 1
    }));
  };

  const refresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setBadges(mockBadges);
      setChallenges(mockChallenges);
      setStats(mockStats);
      setIsLoading(false);
    }, 500);
  };

  return {
    badges,
    challenges,
    stats,
    completeChallenge,
    isLoading,
    error,
    refresh
  };
}

export default useGamification;
