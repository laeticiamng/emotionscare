import { Challenge, Badge } from '@/types';

// Mock data for active challenges
export const activeChallenges: Challenge[] = [
  {
    id: "challenge1",
    title: "Semaine de Gratitude",
    description: "Exprimez votre gratitude chaque jour pendant une semaine",
    points: 150,
    status: "active", // Changed from "ongoing"
    category: "mindfulness",
    progress: 3,
    goal: 7,
    total: 7, // keeping this for backward compatibility
    icon: "Heart"
  },
  {
    id: "challenge2",
    title: "Méditation Quotidienne",
    description: "Méditez pendant 15 minutes chaque jour",
    points: 200,
    status: "active", // Changed from "available"
    category: "mindfulness",
    progress: 0,
    goal: 7,
    total: 7, // keeping this for backward compatibility
    icon: "Aura"
  },
  {
    id: "challenge3",
    title: "Partage de Bienveillance",
    description: "Partagez un acte de gentillesse chaque jour",
    points: 180,
    status: "active",
    category: "social",
    progress: 5,
    goal: 5,
    total: 5, // keeping this for backward compatibility
    icon: "Smile"
  }
];

// Mock data for badges
export const mockBadges: Badge[] = [
  {
    id: "badge1",
    name: "Explorateur Émotionnel", // Ensure name is present
    description: "Votre première analyse émotionnelle",
    image_url: "/images/badges/emotional-explorer.png",
    level: "Débutant" // keeping for backward compatibility
  },
  {
    id: "badge2",
    name: "Maître de la Gratitude", // Ensure name is present
    description: "Badge pour avoir complété une semaine de gratitude",
    image_url: "/images/badges/gratitude-master.png",
    level: "Avancé" // keeping for backward compatibility
  },
  {
    id: "badge3",
    name: "Zenith Méditatif", // Ensure name is present
    description: "Badge pour la méditation quotidienne",
    image_url: "/images/badges/meditative-zenith.png",
    level: "Expert" // keeping for backward compatibility
  }
];
