
import { Badge, Challenge, UserChallenge } from '@/types';

// Types for badge responses
export interface BadgeResponse {
  all: Badge[];
  earned: Badge[];
}

export const fetchBadges = async (): Promise<BadgeResponse> => {
  // Mock implementation - in a real app, this would call an API
  const allBadges: Badge[] = [
    {
      id: '1',
      user_id: 'system',
      name: 'Premier Pas',
      description: 'Première connexion sur EmotionsCare',
      image_url: '/images/badges/first-login.png',
      awarded_at: new Date().toISOString(),
      icon_url: '/images/badges/first-login-icon.png',
      threshold: 1,
      category: 'engagement',
      unlocked: true
    },
    {
      id: '2',
      user_id: 'system',
      name: 'Explorateur Émotionnel',
      description: 'Effectuer 5 scans émotionnels',
      image_url: '/images/badges/emotion-explorer.png',
      awarded_at: new Date().toISOString(),
      icon_url: '/images/badges/emotion-explorer-icon.png',
      threshold: 5,
      category: 'wellness',
      unlocked: true
    },
    {
      id: '3',
      user_id: 'system',
      name: 'Maître du Journal',
      description: 'Rédiger 10 entrées dans le journal émotionnel',
      image_url: '/images/badges/journal-master.png',
      awarded_at: '',
      icon_url: '/images/badges/journal-master-icon.png',
      threshold: 10,
      category: 'wellness',
      unlocked: false
    }
  ];
  
  const earnedBadges = allBadges.filter(badge => badge.unlocked);
  
  return {
    all: allBadges,
    earned: earnedBadges
  };
};

// Add the missing functions for challenge management
export const fetchChallenges = async (): Promise<Challenge[]> => {
  // Mock implementation
  return [
    {
      id: '1',
      title: 'Scan Quotidien',
      description: 'Effectuez un scan émotionnel chaque jour pendant une semaine',
      points: 100,
      category: 'wellness',
      requirements: '7 scans consécutifs',
      icon_url: '/images/challenges/daily-scan.svg'
    },
    {
      id: '2',
      title: 'Journal Régulier',
      description: 'Écrivez dans votre journal 3 fois cette semaine',
      points: 75,
      category: 'wellness',
      requirements: '3 entrées en 7 jours',
      icon_url: '/images/challenges/journal.svg'
    },
    {
      id: '3',
      title: 'Session VR Relaxante',
      description: 'Complétez une session VR de relaxation',
      points: 50,
      category: 'wellness',
      requirements: '1 session de 10 minutes minimum',
      icon_url: '/images/challenges/vr-session.svg'
    }
  ];
};

export const fetchUserChallenges = async (): Promise<UserChallenge[]> => {
  // Mock implementation
  return [
    {
      id: '101',
      user_id: 'current_user',
      challenge_id: '1',
      date: new Date().toISOString(),
      completed: true
    },
    {
      id: '102',
      user_id: 'current_user',
      challenge_id: '2',
      date: new Date().toISOString(),
      completed: false
    }
  ];
};

export const completeChallenge = async (challengeId: string): Promise<boolean> => {
  // Mock implementation
  console.log(`Challenge ${challengeId} marked as completed`);
  return true;
};
