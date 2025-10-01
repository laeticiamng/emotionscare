// @ts-nocheck

/**
 * MOCK DATA
 * Ce fichier respecte strictement le type officiel EmotionResult
 * Toute modification doit être propagée dans le type officiel ET dans tous les composants consommateurs.
 */

import { EmotionResult } from '@/types/emotion';

export const mockEmotionResults: EmotionResult[] = [
  {
    id: "emotion-1",
    emotion: 'calm',
    confidence: 0.87,
    timestamp: new Date().toISOString(),
    intensity: 0.7,
    emojis: ["😌", "🧘"],
    source: "text",
    text: "Je me sens calme après ma session de méditation"
  },
  {
    id: "emotion-2",
    emotion: 'stressed',
    confidence: 0.72,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 jour avant
    intensity: 0.6,
    emojis: ["😓", "⚡"],
    source: "text",
    text: "Journée stressante avec plusieurs réunions et échéances"
  },
  {
    id: "emotion-3",
    emotion: 'happy',
    confidence: 0.91,
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 jours avant
    intensity: 0.8,
    emojis: ["😊", "🎉"],
    source: "system",
    text: "Super journée, j'ai réussi mon projet et passé du temps avec des amis"
  }
];

export default mockEmotionResults;
