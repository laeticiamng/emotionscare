
import { useState, useEffect } from 'react';
import { Badge } from '@/types/gamification';
import { useAuth } from '@/contexts/AuthContext';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  deadline?: Date;
  completed: boolean;
  progress?: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GamificationStats {
  level: number;
  experience: number;
  experienceNeeded: number;
  challenges: {
    completed: number;
    total: number;
  };
  badges: {
    earned: number;
    total: number;
  };
  streak: number;
  points: number;
}

export const useGamification = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<GamificationStats>({
    level: 1,
    experience: 0,
    experienceNeeded: 100,
    challenges: {
      completed: 0,
      total: 0,
    },
    badges: {
      earned: 0,
      total: 0,
    },
    streak: 0,
    points: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    // Simulate loading gamification data
    const loadGamificationData = async () => {
      try {
        setIsLoading(true);
        
        // Mock data - this would be replaced with an API call
        // Load mock badges
        const mockBadges: Badge[] = [
          {
            id: 'badge-1',
            name: 'Premier pas',
            description: 'Première connexion à la plateforme',
            imageUrl: '/assets/badges/first-login.png',
            category: 'engagement',
            level: 1,
            unlocked: true,
            date_earned: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'badge-2',
            name: 'Explorateur émotionnel',
            description: 'Compléter 5 analyses émotionnelles',
            imageUrl: '/assets/badges/emotion-explorer.png',
            category: 'émotion',
            level: 2,
            unlocked: true,
            progress: 100,
            date_earned: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'badge-3',
            name: 'Musicien en herbe',
            description: 'Écouter 10 heures de musique thérapeutique',
            imageUrl: '/assets/badges/music-lover.png',
            category: 'musique',
            level: 2,
            unlocked: false,
            progress: 65,
          },
          {
            id: 'badge-4',
            name: 'Journaliste introspectif',
            description: 'Rédiger 10 entrées de journal',
            imageUrl: '/assets/badges/journal-master.png',
            category: 'journal',
            level: 3,
            unlocked: false,
            progress: 30,
          },
          {
            id: 'badge-5',
            name: 'Zen attitude',
            description: 'Maintenir un état émotionnel calme pendant 7 jours',
            imageUrl: '/assets/badges/zen-master.png',
            category: 'bien-être',
            level: 4,
            unlocked: false,
            progress: 20,
          },
        ];
        
        // Load mock challenges
        const mockChallenges: Challenge[] = [
          {
            id: 'challenge-1',
            title: 'Analyse émotionnelle quotidienne',
            description: 'Réalisez une analyse émotionnelle chaque jour pendant 5 jours consécutifs',
            points: 100,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            completed: false,
            progress: 60,
            category: 'émotion',
            difficulty: 'easy',
          },
          {
            id: 'challenge-2',
            title: 'Séance de musicothérapie',
            description: 'Complétez une séance de musicothérapie de 15 minutes',
            points: 50,
            completed: true,
            category: 'musique',
            difficulty: 'easy',
          },
          {
            id: 'challenge-3',
            title: 'Journal d\'introspection',
            description: 'Rédigez 3 entrées de journal cette semaine',
            points: 150,
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            completed: false,
            progress: 33,
            category: 'journal',
            difficulty: 'medium',
          },
          {
            id: 'challenge-4',
            title: 'Exploration de la réalité virtuelle',
            description: 'Essayez 3 différentes expériences de réalité virtuelle',
            points: 200,
            completed: false,
            progress: 0,
            category: 'vr',
            difficulty: 'medium',
          },
          {
            id: 'challenge-5',
            title: 'Maître de la pleine conscience',
            description: 'Complétez 10 sessions de méditation guidée',
            points: 300,
            completed: false,
            progress: 20,
            category: 'bien-être',
            difficulty: 'hard',
          },
        ];
        
        // Calculate stats
        const completedChallenges = mockChallenges.filter(c => c.completed).length;
        const earnedBadges = mockBadges.filter(b => b.unlocked).length;
        
        const mockStats: GamificationStats = {
          level: 3,
          experience: 370,
          experienceNeeded: 500,
          challenges: {
            completed: completedChallenges,
            total: mockChallenges.length,
          },
          badges: {
            earned: earnedBadges,
            total: mockBadges.length,
          },
          streak: 4,
          points: 520,
        };
        
        setBadges(mockBadges);
        setChallenges(mockChallenges);
        setStats(mockStats);
      } catch (error) {
        console.error('Error loading gamification data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGamificationData();
  }, [user]);

  return {
    badges,
    challenges,
    stats,
    isLoading,
  };
};

export default useGamification;
