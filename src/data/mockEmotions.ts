
/**
 * Mock Emotion Data
 * --------------------------------------
 * This file provides test data that strictly follows the official types defined in /src/types/emotion.ts
 */

import { Emotion } from '@/types/emotion';
import { v4 as uuidv4 } from 'uuid';

const mockEmotions: Emotion[] = [
  {
    id: uuidv4(),
    name: 'Joyeux',
    label: 'happy',
    intensity: 'high', // Changed from number to string enum value
    timestamp: new Date().toISOString(),
    description: "Un état d'esprit positif, caractérisé par la satisfaction et le plaisir.",
    tips: [
      "Profitez du moment présent",
      "Partagez votre joie avec les autres",
      "Notez ce qui vous rend heureux dans un journal"
    ],
    categories: ['positive', 'high-energy'],
    color: '#FFD700'
  },
  {
    id: uuidv4(),
    name: 'Calme',
    label: 'calm',
    intensity: 'medium', // Changed from number to string enum value
    timestamp: new Date(Date.now() - 86400000).toISOString(), // Hier
    description: "État de tranquillité et de paix intérieure, d'absence d'agitation.",
    tips: [
      "Pratiquez la respiration profonde",
      "Prenez un moment pour méditer",
      "Écoutez de la musique apaisante"
    ],
    categories: ['positive', 'low-energy'],
    color: '#4682B4'
  },
  {
    id: uuidv4(),
    name: 'Concentré',
    label: 'focused',
    intensity: 'high', // Changed from number to string enum value
    timestamp: new Date(Date.now() - 172800000).toISOString(), // Avant-hier
    description: "Capacité à diriger son attention de manière soutenue sur une tâche ou une activité.",
    tips: [
      "Éliminez les distractions",
      "Utilisez la technique Pomodoro",
      "Définissez des objectifs clairs"
    ],
    categories: ['neutral', 'high-energy'],
    color: '#800080'
  },
  {
    id: uuidv4(),
    name: 'Anxieux',
    label: 'anxious',
    intensity: 'medium', // Changed from number to string enum value
    timestamp: new Date(Date.now() - 259200000).toISOString(), // Il y a 3 jours
    description: "Sentiment d'inquiétude et d'appréhension face à des situations perçues comme menaçantes.",
    tips: [
      "Pratiquez la respiration 4-7-8",
      "Identifiez la source de votre anxiété",
      "Parlez-en à quelqu'un de confiance"
    ],
    categories: ['negative', 'high-energy'],
    color: '#FFA500'
  },
  {
    id: uuidv4(),
    name: 'Triste',
    label: 'sad',
    intensity: 'low', // Changed from number to string enum value
    timestamp: new Date(Date.now() - 345600000).toISOString(), // Il y a 4 jours
    description: "État émotionnel lié à la perte, la déception ou la mélancolie.",
    tips: [
      "Acceptez vos émotions sans jugement",
      "Ne restez pas isolé, contactez un ami",
      "Faites une activité qui vous plaît"
    ],
    categories: ['negative', 'low-energy'],
    color: '#4169E1'
  }
];

export default mockEmotions;

export type EmotionLabel = 'happy' | 'calm' | 'focused' | 'anxious' | 'sad';

export const getEmotionByLabel = (label: EmotionLabel | string): Emotion | undefined => {
  return mockEmotions.find(emotion => emotion.label === label);
};

export const getRecentEmotions = (limit: number = 5): Emotion[] => {
  return [...mockEmotions].sort((a, b) => 
    new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime()
  ).slice(0, limit);
};
