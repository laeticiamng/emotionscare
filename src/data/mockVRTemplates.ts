
import { VRSessionTemplate } from '@/types/vr';

// Données fictives pour les templates de sessions VR
export const mockVRTemplates: VRSessionTemplate[] = [
  {
    id: "vr-template-1",
    title: "Méditation zen en forêt",
    description: "Une expérience VR apaisante dans une forêt paisible pour pratiquer la méditation pleine conscience.",
    duration: 600, // 10 minutes en secondes
    difficulty: "easy",
    intensity: 1,
    category: "meditation",
    tags: ["pleine conscience", "débutant", "nature"],
    thumbnail: "/images/vr/forest-meditation.jpg",
    created_at: "2023-01-15T08:30:00Z",
    author_name: "Dr. Marie Durand",
    average_rating: 4.8,
    completion_count: 1245
  },
  {
    id: "vr-template-2",
    title: "Relaxation plage tropicale",
    description: "Évadez-vous sur une plage tropicale déserte avec le son des vagues et un exercice guidé de relaxation.",
    duration: 900, // 15 minutes en secondes
    difficulty: "easy",
    intensity: 2,
    category: "relaxation",
    tags: ["plage", "océan", "détente"],
    thumbnail: "/images/vr/tropical-beach.jpg",
    created_at: "2023-02-22T14:15:00Z",
    author_name: "Sophia Martinez",
    average_rating: 4.9,
    completion_count: 2187
  },
  {
    id: "vr-template-3",
    title: "Gestion de l'anxiété - Respiration",
    description: "Exercices de respiration guidée dans un environnement immersif pour réduire l'anxiété et le stress.",
    duration: 1200, // 20 minutes en secondes
    difficulty: "medium",
    intensity: 3,
    category: "anxiety",
    tags: ["respiration", "anti-stress", "thérapeutique"],
    thumbnail: "/images/vr/breathing-exercise.jpg",
    created_at: "2023-03-10T09:45:00Z",
    author_name: "Dr. Thomas Laurent",
    average_rating: 4.7,
    completion_count: 1876
  },
  {
    id: "vr-template-4",
    title: "Sommeil profond - Visualisation",
    description: "Préparez-vous au sommeil avec cette session de visualisation guidée dans un environnement nocturne apaisant.",
    duration: 1800, // 30 minutes en secondes
    difficulty: "easy",
    intensity: 1,
    category: "sleep",
    tags: ["sommeil", "nuit", "visualisation"],
    thumbnail: "/images/vr/deep-sleep.jpg",
    created_at: "2023-04-05T22:00:00Z",
    author_name: "Claire Dubois",
    average_rating: 4.9,
    completion_count: 3214
  },
  {
    id: "vr-template-5",
    title: "Concentration et focus",
    description: "Améliorez votre concentration avec cette session immersive conçue pour entraîner votre attention.",
    duration: 1500, // 25 minutes en secondes
    difficulty: "medium",
    intensity: 4,
    category: "focus",
    tags: ["concentration", "productivité", "mental"],
    thumbnail: "/images/vr/focus-training.jpg",
    created_at: "2023-05-18T10:30:00Z",
    author_name: "Dr. Nicolas Bernard",
    average_rating: 4.6,
    completion_count: 1523
  },
  {
    id: "vr-template-6",
    title: "Gestion de la colère - Océan calme",
    description: "Apprenez à gérer votre colère et frustration avec cette expérience thérapeutique au bord de l'océan.",
    duration: 1200, // 20 minutes en secondes
    difficulty: "hard",
    intensity: 3,
    category: "anger",
    tags: ["gestion émotionnelle", "thérapie", "océan"],
    thumbnail: "/images/vr/calm-ocean.jpg",
    created_at: "2023-06-20T16:45:00Z",
    author_name: "Prof. Élodie Martin",
    average_rating: 4.7,
    completion_count: 1287
  }
];

export default mockVRTemplates;
