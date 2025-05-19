
import { Badge } from '@/types/badge';

export const mockBadges: Badge[] = [
  {
    id: "1",
    name: "Early adopter",
    description: "Un des premiers à rejoindre la plateforme",
    imageUrl: "/badges/early-adopter.png",
    unlocked: true,
    category: "system",
    tier: "bronze",
    rarity: "rare"
  },
  {
    id: "2",
    name: "Émotions partagées",
    description: "Partager ses émotions 10 fois",
    imageUrl: "/badges/emotion-sharing.png",
    unlocked: true,
    category: "emotion",
    progress: 10,
    threshold: 10,
    completed: true,
    tier: "silver"
  },
  {
    id: "3",
    name: "Journaliste en herbe",
    description: "Créer 5 entrées de journal",
    imageUrl: "/badges/journal-writer.png",
    unlocked: false,
    category: "journal",
    progress: 3,
    threshold: 5,
    completed: false,
    tier: "bronze"
  },
  {
    id: "4", 
    name: "Mélomane",
    description: "Écouter 20 morceaux de musique",
    imageUrl: "/badges/music-lover.png",
    unlocked: false,
    category: "music",
    progress: 12,
    threshold: 20,
    completed: false,
    tier: "gold"
  }
];

export default mockBadges;
