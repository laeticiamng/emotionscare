
/**
 * Mock VR Templates
 * --------------------------------------
 * This file provides test data that strictly follows the official types defined in /src/types/vr.ts
 */

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
    thumbnailUrl: "/images/vr/forest-meditation.jpg", // Renamed from thumbnail to thumbnailUrl
    createdAt: "2023-01-15T08:30:00Z", // Using modern naming
    authorName: "Dr. Marie Durand", // Using modern naming
    averageRating: 4.8, // Using modern naming
    completionCount: 1245 // Using modern naming
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
    thumbnailUrl: "/images/vr/tropical-beach.jpg", // Renamed from thumbnail to thumbnailUrl
    createdAt: "2023-02-22T14:15:00Z", // Using modern naming
    authorName: "Sophia Martinez", // Using modern naming
    averageRating: 4.9, // Using modern naming
    completionCount: 2187 // Using modern naming
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
    thumbnailUrl: "/images/vr/breathing-exercise.jpg", // Renamed from thumbnail to thumbnailUrl
    createdAt: "2023-03-10T09:45:00Z", // Using modern naming
    authorName: "Dr. Thomas Laurent", // Using modern naming
    averageRating: 4.7, // Using modern naming
    completionCount: 1876 // Using modern naming
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
    thumbnailUrl: "/images/vr/deep-sleep.jpg", // Renamed from thumbnail to thumbnailUrl
    createdAt: "2023-04-05T22:00:00Z", // Using modern naming
    authorName: "Claire Dubois", // Using modern naming
    averageRating: 4.9, // Using modern naming
    completionCount: 3214 // Using modern naming
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
    thumbnailUrl: "/images/vr/focus-training.jpg", // Renamed from thumbnail to thumbnailUrl
    createdAt: "2023-05-18T10:30:00Z", // Using modern naming
    authorName: "Dr. Nicolas Bernard", // Using modern naming
    averageRating: 4.6, // Using modern naming
    completionCount: 1523 // Using modern naming
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
    thumbnailUrl: "/images/vr/calm-ocean.jpg", // Renamed from thumbnail to thumbnailUrl
    createdAt: "2023-06-20T16:45:00Z", // Using modern naming
    authorName: "Prof. Élodie Martin", // Using modern naming
    averageRating: 4.7, // Using modern naming
    completionCount: 1287 // Using modern naming
  }
];

export default mockVRTemplates;
