import { Emotion } from '@/types';

export const mockEmotions: Emotion[] = [
  {
    id: '1',
    user_id: 'user-1',
    date: '2023-05-01T08:30:00Z',
    emotion: 'happy',
    score: 85,
    confidence: 0.9, // Added required field
    text: "Je me sens plein d'énergie aujourd'hui !",
    ai_feedback: "Excellent ! Votre humeur positive est bénéfique pour la productivité."
  },
  {
    id: '2',
    user_id: 'user-1',
    date: '2023-05-02T09:15:00Z',
    emotion: 'neutral',
    score: 60,
    confidence: 0.7, // Added required field
    text: "Journée ordinaire jusqu'à présent.",
    ai_feedback: "Une humeur neutre peut être une bonne base pour la concentration."
  },
  {
    id: '3',
    user_id: 'user-1',
    date: '2023-05-03T10:00:00Z',
    emotion: 'sad',
    score: 30,
    confidence: 0.8, // Added required field
    text: "Je me sens un peu triste aujourd'hui.",
    ai_feedback: "Il est normal de se sentir triste parfois. Prenez soin de vous."
  },
  {
    id: '4',
    user_id: 'user-1',
    date: '2023-05-04T11:45:00Z',
    emotion: 'anxious',
    score: 40,
    confidence: 0.6, // Added required field
    text: "Je suis inquiet à propos de la réunion de demain.",
    ai_feedback: "Essayez de vous préparer autant que possible pour réduire l'anxiété."
  },
  {
    id: '5',
    user_id: 'user-1',
    date: '2023-05-05T13:20:00Z',
    emotion: 'calm',
    score: 75,
    confidence: 0.9, // Added required field
    text: "Je me sens calme et détendu après la méditation.",
    ai_feedback: "La méditation est un excellent moyen de maintenir le calme."
  }
];

export const getMockEmotions = async (userId: string): Promise<Emotion[]> => {
  return mockEmotions.filter(emotion => emotion.user_id === userId);
};

export const getMockEmotionById = async (id: string): Promise<Emotion | undefined> => {
  return mockEmotions.find(emotion => emotion.id === id);
};

export const createMockEmotion = async (emotion: Emotion): Promise<Emotion> => {
  mockEmotions.push(emotion);
  return emotion;
};

export const updateMockEmotion = async (id: string, updates: Partial<Emotion>): Promise<Emotion | undefined> => {
  const emotionIndex = mockEmotions.findIndex(emotion => emotion.id === id);
  if (emotionIndex === -1) {
    return undefined;
  }
  mockEmotions[emotionIndex] = { ...mockEmotions[emotionIndex], ...updates };
  return mockEmotions[emotionIndex];
};

export const deleteMockEmotion = async (id: string): Promise<boolean> => {
  const emotionIndex = mockEmotions.findIndex(emotion => emotion.id === id);
  if (emotionIndex === -1) {
    return false;
  }
  mockEmotions.splice(emotionIndex, 1);
  return true;
};
