
import { Badge } from '@/types';

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Early Adopter',
    description: 'Joined during the beta phase',
    icon: 'award',
    unlocked: true,
    image: '/badges/early-adopter.png',
    dateEarned: '2023-05-10T10:30:00Z',
  },
  {
    id: '2',
    name: 'Emotion Explorer',
    description: 'Recorded 10 different emotions',
    icon: 'compass',
    unlocked: true,
    image: '/badges/emotion-explorer.png',
    dateEarned: '2023-06-15T14:20:00Z',
  },
  {
    id: '3',
    name: 'Mindfulness Master',
    description: 'Completed 20 VR meditation sessions',
    icon: 'brain',
    unlocked: false,
    image: '/badges/mindfulness-master.png',
    threshold: 20,
    progress: 12,
  },
  {
    id: '4',
    name: 'Consistent Tracker',
    description: 'Logged emotions for 30 consecutive days',
    icon: 'calendar',
    unlocked: false,
    image: '/badges/consistent-tracker.png',
    threshold: 30,
    progress: 22,
  }
];
