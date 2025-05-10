
import { Emotion } from "@/types";

export const mockEmotionData: Emotion[] = [
  {
    id: "e1",
    user_id: "user1",
    date: "2023-03-20T10:00:00Z",
    emotion: "joy",
    name: "joy",
    category: "positive",
    score: 0.85,
    confidence: 0.9,
    text: "Aujourd'hui, j'ai reçu une excellente nouvelle au travail !",
    ai_feedback: "C'est formidable de voir votre joie. Prenez le temps de savourer ce moment.",
    intensity: 0.8
  },
  {
    id: "e2",
    user_id: "user1",
    date: "2023-03-19T15:30:00Z",
    emotion: "stress",
    name: "stress",
    category: "negative",
    score: 0.6,
    confidence: 0.75,
    text: "Échéance de projet qui approche, je me sens un peu dépassé.",
    ai_feedback: "Le stress temporaire est normal. Essayez de diviser vos tâches en plus petites portions gérables.",
    intensity: 0.7
  },
  {
    id: "e3",
    user_id: "user1",
    date: "2023-03-18T09:15:00Z",
    emotion: "calm",
    name: "calm",
    category: "positive",
    score: 0.7,
    confidence: 0.8,
    text: "J'ai pratiqué la méditation ce matin, je me sens centré.",
    ai_feedback: "La méditation est une excellente pratique pour maintenir l'équilibre émotionnel. Continuez ainsi !",
    intensity: 0.6
  },
  {
    id: "e4",
    user_id: "user1",
    date: "2023-03-17T18:45:00Z",
    emotion: "fatigue",
    name: "fatigue",
    category: "negative",
    score: 0.5,
    confidence: 0.85,
    text: "Longue journée, je me sens épuisé.",
    ai_feedback: "Assurez-vous de bien vous reposer ce soir. Considérez une routine de sommeil plus régulière.",
    intensity: 0.7
  },
  {
    id: "e5",
    user_id: "user1",
    date: "2023-03-16T12:20:00Z",
    emotion: "gratitude",
    name: "gratitude",
    category: "positive",
    score: 0.9,
    confidence: 0.95,
    text: "Reconnaissant pour le soutien de mes collègues aujourd'hui.",
    ai_feedback: "La gratitude est l'une des émotions les plus bénéfiques. Envisagez de tenir un journal de gratitude.",
    intensity: 0.8
  }
];

export default mockEmotionData;
