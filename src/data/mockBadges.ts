
import { Badge } from '../types';

// Mock Badges
export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Premier pas',
    description: 'Première session de VR complétée',
    image_url: '/badges/first-step.svg',
    category: 'achievement',
    unlocked: true,
    awarded_at: '2023-04-15T14:30:00Z',
  },
  {
    id: '2',
    name: 'Journal assidu',
    description: '5 entrées de journal consécutives',
    image_url: '/badges/journal-master.svg',
    category: 'consistency',
    unlocked: true,
    awarded_at: '2023-04-18T09:15:00Z',
  },
];
