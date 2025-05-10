
import { Badge } from '../types';

// Mock Badges
export const mockBadges: Badge[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'Premier pas',
    description: 'Première session de VR complétée',
    image_url: '/badges/first-step.svg',
    icon: 'award',
    icon_url: '/badges/first-step.svg',
    level: 1,
    awarded_at: '2023-04-15T14:30:00Z',
    unlocked: true,
    threshold: 1
  },
  {
    id: '2',
    user_id: 'user-1',
    name: 'Journal assidu',
    description: '5 entrées de journal consécutives',
    image_url: '/badges/journal-master.svg',
    icon: 'book',
    icon_url: '/badges/journal-master.svg',
    level: 1,
    awarded_at: '2023-04-18T09:15:00Z',
    unlocked: true,
    threshold: 5
  },
];
