// @ts-nocheck

import { VRSessionTemplate } from '@/types/vr';
import { normalizeDifficulty } from '@/components/vr/utils';

export const vrTemplates: VRSessionTemplate[] = [
  {
    id: "template-1",
    title: "Méditation pleine conscience",
    name: "Méditation pleine conscience",
    description: "Une session guidée pour cultiver l'attention et la pleine conscience.",
    thumbnailUrl: "/images/vr/meditation-thumbnail.jpg",
    imageUrl: "/images/vr/meditation.jpg",
    duration: 10,
    difficulty: normalizeDifficulty("beginner"),
    category: "meditation",
    audioUrl: "/audio/meditation-pleine-conscience.mp3",
    tags: ["relaxation", "débutant", "stress"],
    isFeatured: true
  },
  {
    id: "template-2",
    title: "Respiration profonde",
    name: "Respiration profonde",
    description: "Apprenez à vous détendre grâce à des techniques de respiration profonde.",
    thumbnailUrl: "/images/vr/breathing-thumbnail.jpg",
    imageUrl: "/images/vr/breathing.jpg",
    duration: 5,
    difficulty: normalizeDifficulty("beginner"),
    category: "breathing",
    audioUrl: "/audio/respiration-profonde.mp3",
    tags: ["relaxation", "stress", "rapide"]
  },
  {
    id: "template-3",
    title: "Méditation guidée avancée",
    name: "Méditation guidée avancée",
    description: "Une méditation plus profonde pour les praticiens expérimentés.",
    thumbnailUrl: "/images/vr/advanced-meditation-thumbnail.jpg",
    imageUrl: "/images/vr/advanced-meditation.jpg",
    duration: 20,
    difficulty: normalizeDifficulty("advanced"),
    category: "meditation",
    audioUrl: "/audio/meditation-avancee.mp3",
    tags: ["avancé", "profond", "concentration"]
  }
];

export default vrTemplates;
