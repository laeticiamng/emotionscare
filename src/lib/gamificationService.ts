
import { Badge, Challenge, UserChallenge } from '@/types';
import { mockBadges } from '@/data/mockBadges';

// Mocked badges data and service functions
// In a real app, these would make API calls to a server

export const fetchUserBadges = async (userId: string): Promise<Badge[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter badges by user_id
      const userBadges = mockBadges.filter(badge => badge.user_id === userId);
      resolve(userBadges);
    }, 500);
  });
};

export const fetchBadgeById = async (badgeId: string): Promise<Badge | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const badge = mockBadges.find(b => b.id === badgeId);
      resolve(badge || null);
    }, 300);
  });
};

// Mock available badges for all users
export const fetchAvailableBadges = async (): Promise<Badge[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const availableBadges: Badge[] = [
        {
          id: "available-1",
          user_id: "", // Empty as it's not awarded yet
          name: "Premier pas",
          description: "Commencer son parcours de bien-être émotionnel",
          icon_url: "/badges/first-steps.svg",
          threshold: 1,
          awarded_at: ""
        },
        {
          id: "available-2", 
          user_id: "",
          name: "Explorateur émotionnel",
          description: "Découvrir 5 activités différentes",
          icon_url: "/badges/explorer.svg",
          threshold: 5,
          awarded_at: ""
        },
        {
          id: "available-3",
          user_id: "",
          name: "Maître Zen",
          description: "Compléter 10 sessions de méditation",
          icon_url: "/badges/zen-master.svg",
          threshold: 10,
          awarded_at: ""
        }
      ];
      resolve(availableBadges);
    }, 500);
  });
};

export const fetchBadgesCount = async (userId: string): Promise<number> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const userBadges = mockBadges.filter(badge => badge.user_id === userId);
      resolve(userBadges.length);
    }, 200);
  });
};

// Mock challenges
const mockChallenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "7 jours de scan émotionnel",
    description: "Effectuez un scan émotionnel chaque jour pendant une semaine",
    points: 100,
    category: "bien-être",
    requirements: "7 scans consécutifs",
    icon_url: "/challenges/weekly-scan.svg"
  },
  {
    id: "challenge-2",
    title: "Journal de gratitude",
    description: "Notez 3 choses pour lesquelles vous êtes reconnaissant",
    points: 50,
    category: "journal",
    requirements: "3 entrées de journal",
    icon_url: "/challenges/gratitude.svg"
  },
  {
    id: "challenge-3",
    title: "Session VR relaxante",
    description: "Complétez une session VR de relaxation de 10 minutes",
    points: 75,
    category: "vr",
    requirements: "1 session VR complète",
    icon_url: "/challenges/vr-session.svg"
  }
];

// Mock user challenges
const mockUserChallenges: UserChallenge[] = [
  {
    id: "user-challenge-1",
    user_id: "1", // Sophie
    challenge_id: "challenge-1",
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    completed: true
  },
  {
    id: "user-challenge-2",
    user_id: "1", // Sophie
    challenge_id: "challenge-2",
    date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    completed: false
  }
];

// Challenge-related functions
export const fetchChallenges = async (): Promise<Challenge[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockChallenges);
    }, 500);
  });
};

export const fetchUserChallenges = async (userId: string): Promise<UserChallenge[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const challenges = mockUserChallenges.filter(c => c.user_id === userId);
      resolve(challenges);
    }, 500);
  });
};

export const completeChallenge = async (
  userId: string, 
  challengeId: string
): Promise<UserChallenge> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if user already has this challenge
      const existingChallenge = mockUserChallenges.find(
        c => c.user_id === userId && c.challenge_id === challengeId
      );
      
      if (existingChallenge) {
        // Update existing challenge
        existingChallenge.completed = true;
        existingChallenge.date = new Date().toISOString();
        resolve(existingChallenge);
      } else {
        // Create new completed challenge
        const newChallenge: UserChallenge = {
          id: `user-challenge-${Date.now()}`,
          user_id: userId,
          challenge_id: challengeId,
          date: new Date().toISOString(),
          completed: true
        };
        
        // In a real app, would add to database
        mockUserChallenges.push(newChallenge);
        resolve(newChallenge);
      }
    }, 700);
  });
};

export const fetchBadges = async (userId: string) => {
  return fetchUserBadges(userId);
};
