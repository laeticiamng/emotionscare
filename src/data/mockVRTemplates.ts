// @ts-nocheck - Mock data file with flexible typing
import { VRSessionTemplate } from '@/types/vr';

export const mockVRTemplates: VRSessionTemplate[] = [
  {
    id: "vr-template-1",
    title: "Méditation en forêt",
    name: "Méditation en forêt",
    description: "Une session de méditation immersive dans une forêt calme avec le son des oiseaux et du vent dans les arbres.",
    duration: 15,
    thumbnailUrl: "/images/vr/forest-meditation.jpg",
    environment: "forest",
    category: "meditation",
    tags: ["relaxation", "nature", "beginner"],
    difficulty: "beginner",
    intensity: 1,
    immersionLevel: "Medium",
    features: ["Audio 3D", "Guide vocal", "Respirations guidées"],
    rating: 4.8,
    audioUrl: "/sounds/forest-meditation.mp3",
    goalType: "relaxation" // Now included in our interface
  },
  {
    id: "vr-template-2",
    title: "Plage au coucher de soleil",
    name: "Plage au coucher de soleil",
    description: "Détendez-vous sur une plage paisible alors que le soleil se couche à l'horizon, avec le son apaisant des vagues.",
    duration: 20,
    thumbnailUrl: "/images/vr/sunset-beach.jpg",
    environment: "beach",
    category: "relaxation",
    tags: ["ocean", "sunset", "calm"],
    difficulty: "beginner",
    intensity: 1,
    immersionLevel: "High",
    features: ["Ambient sounds", "Guided breathing", "Temperature simulation"],
    rating: 4.9,
    audioUrl: "/sounds/ocean-waves.mp3",
    goalType: "stress-reduction" // Now included in our interface
  },
  {
    id: "vr-template-3",
    title: "Montagne enneigée",
    name: "Montagne enneigée",
    description: "Une expérience immersive au sommet d'une montagne avec une vue panoramique sur un paysage enneigé.",
    duration: 30,
    thumbnailUrl: "/images/vr/snowy-mountain.jpg",
    environment: "mountain",
    category: "exploration",
    tags: ["winter", "adventure", "scenery"],
    difficulty: "intermediate",
    intensity: 2,
    immersionLevel: "High",
    features: ["Interactive elements", "Weather simulation", "Guided exploration"],
    rating: 4.7,
    audioUrl: "/sounds/mountain-wind.mp3",
    goalType: "mindfulness" // Now included in our interface
  },
  {
    id: "vr-template-4",
    title: "Espace et étoiles",
    name: "Espace et étoiles",
    description: "Flottez dans l'espace en observant des galaxies, étoiles et planètes dans une expérience cosmique méditative.",
    duration: 25,
    thumbnailUrl: "/images/vr/space.jpg",
    environment: "space",
    category: "meditation",
    tags: ["space", "cosmic", "deep-relaxation"],
    difficulty: "beginner",
    intensity: 1,
    immersionLevel: "Very High",
    features: ["Cosmic visuals", "Ambient music", "Zero-gravity simulation"],
    rating: 4.9,
    audioUrl: "/sounds/cosmic-ambient.mp3",
    goalType: "awe" // Now included in our interface
  }
];

export default mockVRTemplates;
