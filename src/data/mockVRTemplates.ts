
/**
 * MOCK DATA
 * Ce fichier respecte strictement le type officiel VRSessionTemplate
 * Toute modification doit être propagée dans le type officiel ET dans tous les composants consommateurs.
 */

import { VRSessionTemplate } from '@/types/vr';

// Données fictives pour les templates de sessions VR
export const mockVRTemplates: VRSessionTemplate[] = [
  {
    id: "vr-template-1",
    title: "Méditation zen en forêt",
    description: "Une expérience VR apaisante dans une forêt paisible pour pratiquer la méditation pleine conscience.",
    thumbnailUrl: "/images/vr/forest-meditation.jpg",
    duration: 600, // 10 minutes en secondes
    difficulty: "easy",
    category: "meditation",
    tags: ["pleine conscience", "débutant", "nature"],
    immersionLevel: "medium",
    goalType: "meditation",
    interactive: false
  },
  {
    id: "vr-template-2",
    title: "Relaxation plage tropicale",
    description: "Évadez-vous sur une plage tropicale déserte avec le son des vagues et un exercice guidé de relaxation.",
    thumbnailUrl: "/images/vr/tropical-beach.jpg",
    duration: 900, // 15 minutes en secondes
    difficulty: "easy",
    category: "relaxation",
    tags: ["plage", "océan", "détente"],
    immersionLevel: "high",
    goalType: "relaxation",
    interactive: false
  },
  {
    id: "vr-template-3",
    title: "Gestion de l'anxiété - Respiration",
    description: "Exercices de respiration guidée dans un environnement immersif pour réduire l'anxiété et le stress.",
    thumbnailUrl: "/images/vr/breathing-exercise.jpg",
    duration: 1200, // 20 minutes en secondes
    difficulty: "medium",
    category: "anxiety",
    tags: ["respiration", "anti-stress", "thérapeutique"],
    immersionLevel: "medium",
    goalType: "meditation",
    interactive: true
  },
  {
    id: "vr-template-4",
    title: "Sommeil profond - Visualisation",
    description: "Préparez-vous au sommeil avec cette session de visualisation guidée dans un environnement nocturne apaisant.",
    thumbnailUrl: "/images/vr/deep-sleep.jpg",
    duration: 1800, // 30 minutes en secondes
    difficulty: "easy",
    category: "sleep",
    tags: ["sommeil", "nuit", "visualisation"],
    immersionLevel: "medium",
    goalType: "relaxation",
    interactive: false
  },
  {
    id: "vr-template-5",
    title: "Concentration et focus",
    description: "Améliorez votre concentration avec cette session immersive conçue pour entraîner votre attention.",
    thumbnailUrl: "/images/vr/focus-training.jpg",
    duration: 1500, // 25 minutes en secondes
    difficulty: "medium",
    category: "focus",
    tags: ["concentration", "productivité", "mental"],
    immersionLevel: "high",
    goalType: "focus",
    interactive: true
  },
  {
    id: "vr-template-6",
    title: "Gestion de la colère - Océan calme",
    description: "Apprenez à gérer votre colère et frustration avec cette expérience thérapeutique au bord de l'océan.",
    thumbnailUrl: "/images/vr/calm-ocean.jpg",
    duration: 1200, // 20 minutes en secondes
    difficulty: "hard",
    category: "anger",
    tags: ["gestion émotionnelle", "thérapie", "océan"],
    immersionLevel: "medium",
    goalType: "relaxation",
    interactive: true
  }
];

export default mockVRTemplates;
