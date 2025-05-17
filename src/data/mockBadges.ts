
import { Badge } from '@/types/badge';

// Mock Badges
export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Premier pas',
    description: 'Première session de VR complétée',
    image_url: '/badges/first-step.svg',
    imageUrl: '/badges/first-step.svg',
    icon: 'award',
    threshold: 1,
    earned: false
  },
  {
    id: '2',
    name: 'Journal assidu',
    description: '5 entrées de journal consécutives',
    image_url: '/badges/journal-master.svg',
    imageUrl: '/badges/journal-master.svg',
    icon: 'book',
    threshold: 5,
    earned: false
  },
];

export default mockBadges;
