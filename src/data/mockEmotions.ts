import { Emotion } from '@/types';

export const mockEmotions: Emotion[] = [
  {
    id: "emo1",
    user_id: "user123",
    date: "2023-04-01T10:00:00Z",
    emotion: "joy",
    name: "joy",
    score: 85,
    confidence: 0.92,
    intensity: 0.8,
    category: "positive"
  },
  {
    id: "emo2",
    user_id: "user123",
    date: "2023-04-05T14:30:00Z",
    emotion: "sadness",
    name: "sadness",
    score: 30,
    confidence: 0.88,
    intensity: 0.6,
    category: "negative"
  },
  {
    id: "emo3",
    user_id: "user456",
    date: "2023-04-10T09:15:00Z",
    emotion: "anger",
    name: "anger",
    score: 70,
    confidence: 0.95,
    intensity: 0.7,
    category: "negative"
  },
  {
    id: "emo4",
    user_id: "user456",
    date: "2023-04-12T16:45:00Z",
    emotion: "fear",
    name: "fear",
    score: 45,
    confidence: 0.90,
    intensity: 0.5,
    category: "negative"
  },
  {
    id: "emo5",
    user_id: "user789",
    date: "2023-04-15T11:00:00Z",
    emotion: "calm",
    name: "calm",
    score: 90,
    confidence: 0.98,
    intensity: 0.9,
    category: "neutral"
  },
  {
    id: "emo6",
    user_id: "user789",
    date: "2023-04-18T13:20:00Z",
    emotion: "surprise",
    name: "surprise",
    score: 60,
    confidence: 0.85,
    intensity: 0.4,
    category: "neutral"
  },
  {
    id: "emo7",
    user_id: "user101",
    date: "2023-04-20T08:00:00Z",
    emotion: "joy",
    name: "joy",
    score: 95,
    confidence: 0.99,
    intensity: 0.95,
    category: "positive"
  },
  {
    id: "emo8",
    user_id: "user101",
    date: "2023-04-22T17:50:00Z",
    emotion: "sadness",
    name: "sadness",
    score: 20,
    confidence: 0.80,
    intensity: 0.3,
    category: "negative"
  },
  {
    id: "emo9",
    user_id: "user101",
    date: "2023-05-01T10:00:00Z",
    emotion: "neutral",
    name: "neutral",
    score: 50,
    confidence: 0.75,
    intensity: 0.2,
    category: "neutral"
  }
];
