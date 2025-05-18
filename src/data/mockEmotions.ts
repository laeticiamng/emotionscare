
/**
 * MOCK DATA
 * Ce fichier respecte strictement le type officiel Emotion
 * Toute modification doit être propagée dans le type officiel ET dans tous les composants consommateurs.
 */

import { EmotionResult } from '@/types/emotion';
import { v4 as uuidv4 } from 'uuid';

const mockEmotions: EmotionResult[] = [
  {
    id: uuidv4(),
    emotion: "happy",
    confidence: 0.9,
    intensity: 0.8,
    timestamp: new Date().toISOString(),
    emojis: ["😊", "🎉"],
    source: "manual",
    text: "Un état d'esprit positif, caractérisé par la satisfaction et le plaisir.",
    feedback: "Profitez du moment présent. Partagez votre joie avec les autres."
  },
  {
    id: uuidv4(),
    emotion: "calm",
    confidence: 0.85,
    intensity: 0.6,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // Hier
    emojis: ["😌", "🧘"],
    source: "scan",
    text: "État de tranquillité et de paix intérieure, d'absence d'agitation.",
    feedback: "Pratiquez la respiration profonde. Prenez un moment pour méditer."
  },
  {
    id: uuidv4(),
    emotion: "focused",
    confidence: 0.8,
    intensity: 0.7,
    timestamp: new Date(Date.now() - 172800000).toISOString(), // Avant-hier
    emojis: ["🧠", "🎯"],
    source: "manual",
    text: "Capacité à diriger son attention de manière soutenue sur une tâche ou une activité.",
    feedback: "Éliminez les distractions. Utilisez la technique Pomodoro."
  },
  {
    id: uuidv4(),
    emotion: "anxious",
    confidence: 0.75,
    intensity: 0.6,
    timestamp: new Date(Date.now() - 259200000).toISOString(), // Il y a 3 jours
    emojis: ["😰", "⚡"],
    source: "scan",
    text: "Sentiment d'inquiétude et d'appréhension face à des situations perçues comme menaçantes.",
    feedback: "Pratiquez la respiration 4-7-8. Identifiez la source de votre anxiété."
  },
  {
    id: uuidv4(),
    emotion: "sad",
    confidence: 0.8,
    intensity: 0.5,
    timestamp: new Date(Date.now() - 345600000).toISOString(), // Il y a 4 jours
    emojis: ["😢", "💙"],
    source: "manual",
    text: "État émotionnel lié à la perte, la déception ou la mélancolie.",
    feedback: "Acceptez vos émotions sans jugement. Ne restez pas isolé, contactez un ami."
  }
];

export default mockEmotions;

export type EmotionLabel = 'happy' | 'calm' | 'focused' | 'anxious' | 'sad';

export const getEmotionByLabel = (label: EmotionLabel | string): EmotionResult | undefined => {
  return mockEmotions.find(emotion => emotion.emotion === label);
};

export const getRecentEmotions = (limit: number = 5): EmotionResult[] => {
  return [...mockEmotions].sort((a, b) => 
    new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime()
  ).slice(0, limit);
};
