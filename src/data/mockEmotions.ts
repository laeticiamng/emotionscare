
import { Emotion } from '@/types';

export const mockEmotions: Emotion[] = [
  {
    id: '1',
    user_id: 'user1',
    date: '2023-05-14T08:30:00Z',
    emotion: 'joy',
    score: 8,
    text: 'Feeling great today!',
    emojis: '😊',
    ai_feedback: 'Great to see you in such a positive mood!',
    anxiety: 2
  },
  {
    id: '2',
    user_id: 'user1',
    date: '2023-05-14T12:45:00Z',
    emotion: 'sadness',
    score: 3,
    text: 'A bit disappointed with the project outcome.',
    emojis: '😔',
    ai_feedback: 'I am here to support you. Let's discuss ways to improve.',
    anxiety: 6
  },
  {
    id: '3',
    user_id: 'user2',
    date: '2023-05-14T15:20:00Z',
    emotion: 'anger',
    score: 6,
    text: 'Frustrated with the slow progress.',
    emojis: '😡',
    ai_feedback: 'Take a deep breath. We can address this together.',
    anxiety: 8
  },
  {
    id: '4',
    user_id: 'user2',
    date: '2023-05-14T18:00:00Z',
    emotion: 'calm',
    score: 7,
    text: 'Relaxing after a long day.',
    emojis: '😌',
    ai_feedback: 'Enjoy your relaxation time!',
    anxiety: 3
  },
  {
    id: '5',
    user_id: 'user3',
    date: '2023-05-14T09:00:00Z',
    emotion: 'fear',
    score: 5,
    text: 'Worried about the upcoming presentation.',
    emojis: '😨',
    ai_feedback: 'I can help you prepare. Let's practice together.',
    anxiety: 9
  },
  {
    id: '6',
    user_id: 'user3',
    date: '2023-05-14T14:30:00Z',
    emotion: 'joy',
    score: 9,
    text: 'Achieved a major milestone!',
    emojis: '😊',
    ai_feedback: 'Fantastic! Your hard work is paying off.',
    anxiety: 1
  },
  {
    id: '7',
    user_id: 'user4',
    date: '2023-05-14T11:15:00Z',
    emotion: 'sadness',
    score: 4,
    text: 'Missing my family today.',
    emojis: '😔',
    ai_feedback: 'It's okay to feel that way. Maybe schedule a call?',
    anxiety: 5
  },
  {
    id: '8',
    user_id: 'user4',
    date: '2023-05-14T16:45:00Z',
    emotion: 'anger',
    score: 7,
    text: 'Arguments with a colleague.',
    emojis: '😡',
    ai_feedback: 'Let's explore constructive ways to resolve conflicts.',
    anxiety: 7
  },
  {
    id: '9',
    user_id: 'user5',
    date: '2023-05-14T10:00:00Z',
    emotion: 'calm',
    score: 8,
    text: 'Enjoying a peaceful morning.',
    emojis: '😌',
    ai_feedback: 'That's a great way to start the day!',
    anxiety: 2
  },
  {
    id: '10',
    user_id: 'user5',
    date: '2023-05-14T17:30:00Z',
    emotion: 'fear',
    score: 6,
    text: 'Anxious about the health checkup.',
    emojis: '😨',
    ai_feedback: 'I understand your concern. Focus on what you can control.',
    anxiety: 10
  }
];
