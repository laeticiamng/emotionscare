
import { useState, useEffect } from 'react';
import { Badge, Challenge } from '@/types/gamification';
import { LeaderboardEntry } from '@/types/badge';

export const useCommunityGamification = () => {
  // Données simulées pour les badges
  const mockBadges: Badge[] = [
    {
      id: "1",
      name: "Early Adopter",
      description: "Vous êtes parmi les premiers à rejoindre notre communauté",
      imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=badge1",
      image_url: "https://api.dicebear.com/7.x/shapes/svg?seed=badge1",
      tier: "gold",
      icon: "trophy",
      earned: true,
      level: "gold",
      category: "engagement",
      progress: 100,
      threshold: 1,
      unlocked: true,
      completed: true
    },
    {
      id: "2",
      name: "Journal Master",
      description: "Vous avez écrit 20 entrées de journal",
      imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=badge2",
      image_url: "https://api.dicebear.com/7.x/shapes/svg?seed=badge2",
      tier: "silver",
      icon: "book",
      earned: false,
      level: "silver",
      category: "journal",
      progress: 14,
      threshold: 20,
      unlocked: false,
      completed: false
    }
  ];

  // Données simulées pour les défis
  const mockChallenges: Challenge[] = [
    {
      id: "1",
      title: "7 jours de méditation",
      name: "meditation-week",
      description: "Complétez une session de méditation chaque jour pendant une semaine",
      points: 100,
      progress: 5,
      completed: false,
      status: "in-progress",
      category: "meditation",
      goal: 7
    },
    {
      id: "2",
      title: "Journal quotidien",
      name: "daily-journal",
      description: "Écrivez dans votre journal tous les jours pendant 5 jours",
      points: 50,
      progress: 2,
      completed: false,
      status: "in-progress",
      category: "journal",
      goal: 5
    }
  ];

  // Données simulées pour le classement
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      id: "1",
      userId: "user1",
      name: "TheMindfulOne",
      score: 780,
      rank: 1,
      badges: 5,
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"
    },
    {
      id: "2",
      userId: "user2",
      name: "EmotionNavigator",
      score: 650,
      rank: 2,
      badges: 4,
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Emma"
    },
    {
      id: "3",
      userId: "user3",
      name: "SereneSpirit",
      score: 520,
      rank: 3,
      badges: 3,
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophie"
    }
  ];

  return {
    badges: mockBadges,
    challenges: mockChallenges,
    leaderboard: mockLeaderboard,
    loading: false,
    error: null,
    stats: {
      points: 350,
      level: 4,
      badges: mockBadges.filter(badge => badge.earned).length,
      streak: 3,
      streakDays: 3
    }
  };
};

export default useCommunityGamification;
