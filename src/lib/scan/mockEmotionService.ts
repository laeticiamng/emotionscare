
/**
 * MOCK DATA
 * Ce fichier respecte strictement le type officiel EmotionResult
 * Toute modification doit être propagée dans le type officiel ET dans tous les composants consommateurs.
 */

import { EmotionResult } from "@/types/emotion";

export const mockEmotionData: EmotionResult[] = [
  {
    id: "e1",
    userId: "user1",
    user_id: "user1", // For backwards compatibility
    timestamp: "2023-03-20T10:00:00Z", 
    date: "2023-03-20T10:00:00Z", // For backwards compatibility
    emotion: "joy",
    confidence: 0.9,
    score: 0.85, // For backwards compatibility
    text: "Aujourd'hui, j'ai reçu une excellente nouvelle au travail !",
    feedback: "C'est formidable de voir votre joie. Prenez le temps de savourer ce moment.",
    intensity: 0.8,
    emojis: ["😊", "🎉"],
    source: "text"
  },
  {
    id: "e2",
    userId: "user1",
    user_id: "user1", // For backwards compatibility
    timestamp: "2023-03-19T15:30:00Z",
    date: "2023-03-19T15:30:00Z", // For backwards compatibility
    emotion: "stress",
    confidence: 0.75,
    score: 0.6, // For backwards compatibility
    text: "Échéance de projet qui approche, je me sens un peu dépassé.",
    feedback: "Le stress temporaire est normal. Essayez de diviser vos tâches en plus petites portions gérables.",
    intensity: 0.7,
    emojis: ["😓", "⏰"],
    source: "text"
  },
  {
    id: "e3",
    userId: "user1",
    user_id: "user1", // For backwards compatibility
    timestamp: "2023-03-18T09:15:00Z",
    date: "2023-03-18T09:15:00Z", // For backwards compatibility
    emotion: "calm",
    confidence: 0.8,
    score: 0.7, // For backwards compatibility
    text: "J'ai pratiqué la méditation ce matin, je me sens centré.",
    feedback: "La méditation est une excellente pratique pour maintenir l'équilibre émotionnel. Continuez ainsi !",
    intensity: 0.6,
    emojis: ["😌", "🧘"],
    source: "text"
  },
  {
    id: "e4",
    userId: "user1",
    user_id: "user1", // For backwards compatibility
    timestamp: "2023-03-17T18:45:00Z",
    date: "2023-03-17T18:45:00Z", // For backwards compatibility
    emotion: "fatigue",
    confidence: 0.85,
    score: 0.5, // For backwards compatibility
    text: "Longue journée, je me sens épuisé.",
    feedback: "Assurez-vous de bien vous reposer ce soir. Considérez une routine de sommeil plus régulière.",
    intensity: 0.7,
    emojis: ["😴", "🛌"],
    source: "text"
  },
  {
    id: "e5",
    userId: "user1",
    user_id: "user1", // For backwards compatibility
    timestamp: "2023-03-16T12:20:00Z",
    date: "2023-03-16T12:20:00Z", // For backwards compatibility
    emotion: "gratitude",
    confidence: 0.95,
    score: 0.9, // For backwards compatibility
    text: "Reconnaissant pour le soutien de mes collègues aujourd'hui.",
    feedback: "La gratitude est l'une des émotions les plus bénéfiques. Envisagez de tenir un journal de gratitude.",
    intensity: 0.8,
    emojis: ["🙏", "💙"],
    source: "text"
  }
];

export default mockEmotionData;
