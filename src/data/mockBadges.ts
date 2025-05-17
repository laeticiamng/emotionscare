
import { Badge } from '@/types/badge';

export const mockBadges: Badge[] = [
  {
    id: "1",
    name: "Méditation Débutant",
    description: "Complété 5 sessions de méditation guidée",
    image_url: "/images/badges/meditation-starter.png",
    imageUrl: "/images/badges/meditation-starter.png",
    icon: "mindfulness",
    threshold: 5,
    earned: false,
    level: "bronze",
    category: "mindfulness",
    unlocked: false
  },
  {
    id: "2",
    name: "Journal Émotionnel",
    description: "Enregistré des émotions pendant 7 jours consécutifs",
    image_url: "/images/badges/journal-streak.png",
    imageUrl: "/images/badges/journal-streak.png",
    icon: "journal",
    threshold: 7,
    earned: false,
    level: "silver",
    category: "tracking",
    unlocked: false
  }
];
