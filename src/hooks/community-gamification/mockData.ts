
import { GamificationStats, UseCommunityGamificationResult } from './types';
import { Badge, Challenge } from '@/types/gamification';

/**
 * Generate mock gamification stats for demonstration
 */
export const generateMockGamificationStats = (userId: string): GamificationStats => {
  return {
    level: 3,
    points: 2750,
    nextLevelPoints: 3000,
    badges: [
      {
        id: 'badge-1',
        name: 'Premier pas',
        description: 'A rejoint la communauté',
        image_url: '/badges/first-step.png',
        unlocked_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        unlocked: true,
        category: 'onboarding',
        level: 1,
        user_id: userId
      },
      {
        id: 'badge-2',
        name: 'Soutien communautaire',
        description: 'A aidé 5 membres',
        image_url: '/badges/community-support.png',
        unlocked_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        unlocked: true,
        category: 'community',
        level: 2,
        user_id: userId
      },
      {
        id: 'badge-3',
        name: 'Créateur de contenu',
        description: 'A créé 10 publications de qualité',
        image_url: '/badges/content-creator.png',
        unlocked_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        unlocked: true,
        category: 'content',
        level: 2,
        user_id: userId
      }
    ],
    challenges: [
      {
        id: 'challenge-1',
        title: 'Partage de connaissance',
        name: 'Partage de connaissance',
        description: 'Créez une publication éducative dans la communauté',
        progress: 0,
        total: 1,
        points: 100,
        completed: false,
        category: 'social'
      },
      {
        id: 'challenge-2',
        title: 'Connecteur',
        name: 'Connecteur',
        description: 'Connectez-vous avec 3 nouveaux membres',
        progress: 1,
        total: 3,
        points: 150,
        completed: false,
        category: 'social'
      }
    ],
    recentAchievements: [
      {
        type: 'badge',
        id: 'badge-3',
        name: 'Créateur de contenu',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        points: 200
      },
      {
        type: 'level',
        id: 'level-3',
        name: 'Niveau 3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        points: 0
      }
    ]
  };
};

/**
 * Generate emotion-based challenge recommendations
 */
export const getEmotionBasedChallenges = (emotion: string = 'neutral'): Challenge[] => {
  const emotionChallenges: Record<string, Challenge[]> = {
    'calm': [
      {
        id: 'ai-challenge-calm-1',
        title: 'Journal de gratitude',
        name: 'Journal de gratitude',
        description: 'Partagez trois choses pour lesquelles vous êtes reconnaissant aujourd\'hui',
        progress: 0,
        total: 1,
        points: 50,
        completed: false,
        category: 'wellness'
      }
    ],
    'energetic': [
      {
        id: 'ai-challenge-energetic-1',
        title: 'Motivation matinale',
        name: 'Motivation matinale',
        description: 'Partagez votre routine matinale énergisante avec la communauté',
        progress: 0,
        total: 1,
        points: 50,
        completed: false,
        category: 'wellness'
      }
    ],
    'creative': [
      {
        id: 'ai-challenge-creative-1',
        title: 'Inspiration créative',
        name: 'Inspiration créative',
        description: 'Partagez une source d\'inspiration qui a stimulé votre créativité récemment',
        progress: 0,
        total: 1,
        points: 75,
        completed: false,
        category: 'creative'
      }
    ],
    'reflective': [
      {
        id: 'ai-challenge-reflective-1',
        title: 'Question philosophique',
        name: 'Question philosophique',
        description: 'Posez une question réflexive à la communauté et engagez une discussion profonde',
        progress: 0,
        total: 1,
        points: 75,
        completed: false,
        category: 'intellectual'
      }
    ],
    'anxious': [
      {
        id: 'ai-challenge-anxious-1',
        title: 'Technique anti-stress',
        name: 'Technique anti-stress',
        description: 'Partagez une technique efficace pour gérer l\'anxiété que vous avez personnellement testée',
        progress: 0,
        total: 1,
        points: 50,
        completed: false,
        category: 'wellness'
      }
    ],
    'neutral': [
      {
        id: 'ai-challenge-neutral-1',
        title: 'Connexion communautaire',
        name: 'Connexion communautaire',
        description: 'Commentez sur 3 publications d\'autres membres pour créer des liens',
        progress: 0,
        total: 3,
        points: 60,
        completed: false,
        category: 'social'
      }
    ]
  };
  
  return emotionChallenges[emotion] || emotionChallenges.neutral;
};
