
import { Badge } from '@/types/gamification';

// Define a Badge interface if not already defined in types
interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt?: string; // Use this instead of dateEarned
  category: string;
  level: number;
  isUnlocked: boolean;
}

export const getBadgesForUser = async (userId: string): Promise<Badge[]> => {
  // Mock API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return mock badges
  return [
    {
      id: 'badge-1',
      name: 'Emotion Explorer',
      description: 'Completed your first emotion scan',
      iconUrl: '/badges/emotion-explorer.svg',
      earnedAt: '2023-01-15T10:30:00Z',
      category: 'scan',
      level: 1,
      isUnlocked: true
    },
    {
      id: 'badge-2',
      name: 'Focused Mind',
      description: 'Achieved focus state 5 times',
      iconUrl: '/badges/focused-mind.svg',
      earnedAt: '2023-01-20T14:45:00Z',
      category: 'focus',
      level: 2,
      isUnlocked: true
    },
    // Add a badge that's not unlocked yet
    {
      id: 'badge-3',
      name: 'Meditation Master',
      description: 'Complete 10 meditation sessions',
      iconUrl: '/badges/meditation-master.svg',
      category: 'meditation',
      level: 3,
      isUnlocked: false
    }
  ];
};

export const unlockBadge = async (
  userId: string, 
  badgeId: string
): Promise<Badge> => {
  // Mock API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return the unlocked badge
  return {
    id: badgeId,
    name: 'Newly Unlocked Badge',
    description: 'You just unlocked this badge!',
    iconUrl: '/badges/new-badge.svg',
    earnedAt: new Date().toISOString(), // Use earnedAt instead of dateEarned
    category: 'achievement',
    level: 1,
    isUnlocked: true
  };
};
