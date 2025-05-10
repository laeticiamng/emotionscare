
import { Badge } from '../types';

// Mock Badges
export const mockBadges: Badge[] = [
  {
    id: '1',
    user_id: 'user-1', // Now supported by the Badge interface
    name: 'Premier pas',
    description: 'Première session de VR complétée',
    image_url: '/badges/first-step.svg',
    icon: 'award',
    icon_url: '/badges/first-step.svg', // Add this property
    level: 1,
    awarded_at: '2023-04-15T14:30:00Z', // Now supported by the Badge interface
    category: 'achievement',
    unlocked: true,
    threshold: 1 // Add threshold property
  },
  {
    id: '2',
    user_id: 'user-1', // Now supported by the Badge interface
    name: 'Journal assidu',
    description: '5 entrées de journal consécutives',
    image_url: '/badges/journal-master.svg',
    icon: 'book',
    icon_url: '/badges/journal-master.svg', // Add this property
    level: 1,
    awarded_at: '2023-04-18T09:15:00Z', // Now supported by the Badge interface
    category: 'consistency',
    unlocked: true,
    threshold: 5 // Add threshold property
  },
];
