
import { VRSessionTemplate } from '@/types';

const mockVRTemplates: VRSessionTemplate[] = [
  {
    id: "template-1",
    title: "Méditation en forêt",
    name: "Méditation en forêt", // Ajouté
    description: "Une séance de méditation relaxante dans un environnement forestier apaisant",
    thumbnailUrl: "/images/vr/forest-meditation.jpg",
    duration: 15,
    category: "méditation",
    environment: "forêt", // Ajouté
    intensity: "faible", // Ajouté
    objective: "Relaxation et détente", // Ajouté
    tags: ["relaxation", "nature", "méditation guidée"],
    completionRate: 85,
    recommendedMood: "stress",
    emotion: "calm",
    difficulty: "débutant"
  },
  {
    id: "template-2",
    title: "Évasion montagnarde",
    name: "Évasion montagnarde", // Ajouté
    description: "Explorez les sommets majestueux et respirez l'air pur des montagnes",
    thumbnailUrl: "/images/vr/mountain-escape.jpg",
    duration: 20,
    environment: "montagne", // Ajouté
    intensity: "modérée", // Ajouté
    objective: "Exploration et émerveillement", // Ajouté
    category: "exploration",
    tags: ["aventure", "nature", "paysages"],
    completionRate: 92,
    recommendedMood: "curiosité",
    emotion: "wonder",
    difficulty: "intermédiaire"
  },
  {
    id: "template-3",
    title: "Plage tropicale",
    name: "Plage tropicale", // Ajouté
    description: "Détendez-vous sur une plage de sable blanc avec le bruit relaxant des vagues",
    thumbnailUrl: "/images/vr/tropical-beach.jpg",
    duration: 25,
    environment: "plage", // Ajouté
    intensity: "faible", // Ajouté
    objective: "Relaxation profonde", // Ajouté
    category: "relaxation",
    tags: ["plage", "océan", "détente"],
    completionRate: 78,
    recommendedMood: "stress",
    emotion: "calm",
    difficulty: "débutant"
  },
  {
    id: "template-4",
    title: "Cosmos infini",
    name: "Cosmos infini", // Ajouté
    description: "Voyagez à travers les étoiles et explorez les merveilles de l'espace",
    thumbnailUrl: "/images/vr/space-journey.jpg",
    duration: 30,
    environment: "espace", // Ajouté
    intensity: "élevée", // Ajouté
    objective: "Émerveillement et perspective", // Ajouté
    category: "exploration",
    tags: ["espace", "science", "immersif"],
    completionRate: 95,
    recommendedMood: "curiosité",
    emotion: "awe",
    difficulty: "intermédiaire"
  },
  {
    id: "template-5",
    title: "Jardin zen",
    name: "Jardin zen", // Ajouté
    description: "Pratiquez la pleine conscience dans un jardin japonais traditionnel",
    thumbnailUrl: "/images/vr/zen-garden.jpg",
    duration: 20,
    environment: "jardin", // Ajouté
    intensity: "faible", // Ajouté
    objective: "Méditation et pleine conscience", // Ajouté
    category: "méditation",
    tags: ["zen", "pleine conscience", "japonais"],
    completionRate: 88,
    recommendedMood: "anxiété",
    emotion: "peaceful",
    difficulty: "tous niveaux"
  },
  {
    id: "template-6",
    title: "Aurores boréales",
    name: "Aurores boréales", // Ajouté
    description: "Admirez les aurores boréales depuis un paysage arctique enneigé",
    thumbnailUrl: "/images/vr/northern-lights.jpg",
    duration: 15,
    environment: "arctique", // Ajouté
    intensity: "modérée", // Ajouté
    objective: "Contemplation et émerveillement", // Ajouté
    category: "contemplation",
    tags: ["arctique", "nuit", "phénomène naturel"],
    completionRate: 90,
    recommendedMood: "mélancolie",
    emotion: "wonder",
    difficulty: "débutant"
  }
];

export default mockVRTemplates;
