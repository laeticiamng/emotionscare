import { Emotion } from '@/types';

// Mock Emotions
export const mockEmotions: Emotion[] = [
  {
    id: '1',
    user_id: 'user1',
    emotion: 'happy',
    confidence: 0.89,
    date: '2023-11-01T10:00:00Z',
    score: 85,
    text: "Je me sens très heureux aujourd'hui, ma journée a bien commencé.",
    emojis: ['😊', '🌞'], // Fixed: array instead of string
    ai_feedback: "Votre état de joie est remarquable ! Profitez de cette énergie positive pour accomplir quelque chose qui vous tient à cœur aujourd'hui."
  },
  {
    id: '2',
    user_id: 'user1',
    emotion: 'anxious',
    confidence: 0.78,
    date: '2023-10-28T15:30:00Z',
    score: 40,
    text: "Je me sens un peu anxieux à propos de ma présentation de demain.",
    emojis: ['😰', '😓'], // Fixed: array instead of string
    ai_feedback: "L'anxiété est normale avant une présentation importante. Essayez de pratiquer des exercices de respiration et de visualiser un résultat positif."
  },
  {
    id: '3',
    user_id: '1',
    date: '2023-04-14T10:20:00Z',
    emotion: 'calm',
    intensity: 8,
    emojis: ['😊', '😌'], // Fixed: array instead of string
    text: 'Je me sens bien aujourd\'hui, journée productive',
    ai_feedback: 'Votre humeur semble positive. Continuez à cultiver cette énergie positive!',
    score: 82,
  },
  {
    id: '4',
    user_id: '1',
    date: '2023-04-13T11:30:00Z',
    emotion: 'stress',
    intensity: 6,
    emojis: ['😓', '😔'], // Fixed: array instead of string
    text: 'Journée difficile, beaucoup de stress',
    ai_feedback: 'Vous semblez ressentir du stress. Une pause VR de 5 minutes pourrait vous aider.',
    score: 45,
  },
];
