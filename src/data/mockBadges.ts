
import { Badge } from '@/types';

// Mock Badges
export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Premier pas',
    description: 'Première session de VR complétée',
    image_url: '/badges/first-step.svg',
    icon: 'award',
    threshold: 1
  },
  {
    id: '2',
    name: 'Journal assidu',
    description: '5 entrées de journal consécutives',
    image_url: '/badges/journal-master.svg',
    icon: 'book',
    threshold: 5
  },
];

export default mockBadges;
