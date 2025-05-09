
import { v4 as uuidv4 } from 'uuid';
import { JournalEntry } from '@/types';

// Mock journal entries for development
let mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    user_id: 'user-1',
    title: 'Journée productive',
    content: 'Aujourd\'hui était une journée très productive. J\'ai terminé plusieurs tâches importantes et je me sens accompli.',
    mood: 'happy',
    date: '2023-06-01T12:00:00Z',
    created_at: '2023-06-01T12:00:00Z',
    mood_score: 85
  },
  {
    id: '2',
    user_id: 'user-1',
    title: 'Stress au travail',
    content: 'La pression au travail était intense aujourd\'hui. Je dois trouver de meilleures façons de gérer mon stress.',
    mood: 'anxious',
    date: '2023-06-03T15:30:00Z',
    created_at: '2023-06-03T15:30:00Z',
    ai_feedback: 'Essayez des techniques de respiration ou une courte promenade pour réduire le stress.',
    mood_score: 40
  },
  {
    id: '3',
    user_id: 'user-1',
    title: 'Découverte musicale',
    content: 'J\'ai découvert une nouvelle playlist de musique relaxante qui m\'aide à me concentrer. Ça a vraiment amélioré ma journée.',
    mood: 'calm',
    date: '2023-06-05T18:45:00Z',
    created_at: '2023-06-05T18:45:00Z',
    mood_score: 75
  }
];

// Fetch all journal entries for a user
export const fetchJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter entries by user ID
  return mockJournalEntries.filter(entry => entry.user_id === userId);
};

// Fetch a specific journal entry by ID
export const fetchJournalEntry = async (id: string): Promise<JournalEntry | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockJournalEntries.find(entry => entry.id === id);
};

// Create a new journal entry (renamed from saveJournalEntry for compatibility)
export const createJournalEntry = async (entryData: Partial<JournalEntry>): Promise<JournalEntry> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Generate a mood score based on the mood (simple mapping)
  const moodScores: Record<string, number> = {
    'happy': 90,
    'calm': 75,
    'sad': 30,
    'anxious': 40,
    'angry': 20,
    'tired': 50,
    'energetic': 85
  };
  
  // Create new entry
  const newEntry: JournalEntry = {
    id: uuidv4(),
    user_id: entryData.user_id || 'user-1',
    title: entryData.title || 'Sans titre',
    content: entryData.content || '',
    mood: entryData.mood || 'neutral',
    date: entryData.date || new Date().toISOString(),
    created_at: new Date().toISOString(),
    mood_score: moodScores[entryData.mood || 'neutral'] || 50,
  };
  
  // Add AI feedback for certain moods
  if (['anxious', 'sad', 'angry'].includes(newEntry.mood)) {
    newEntry.ai_feedback = generateAIFeedback(newEntry.mood);
  }
  
  // Add to mock database
  mockJournalEntries.push(newEntry);
  
  return newEntry;
};

// Simple AI feedback generator based on mood
function generateAIFeedback(mood: string): string {
  const feedbacks: Record<string, string[]> = {
    'anxious': [
      'Essayez des exercices de respiration profonde pour réduire votre anxiété.',
      'Prenez quelques minutes pour méditer et vous recentrer.',
      'Faire une courte promenade peut aider à réduire les tensions.',
    ],
    'sad': [
      'Rappelez-vous que les émotions sont temporaires et fluctuantes.',
      'Essayez de vous connecter avec un ami ou un proche aujourd\'hui.',
      'Pratiquez l\'auto-compassion et soyez gentil avec vous-même.',
    ],
    'angry': [
      'Essayez de prendre du recul avant de réagir dans le feu de l\'action.',
      'La colère masque souvent d\'autres émotions comme la peur ou la tristesse.',
      'Une activité physique peut vous aider à évacuer cette énergie.',
    ]
  };
  
  const moodFeedbacks = feedbacks[mood] || feedbacks['anxious'];
  return moodFeedbacks[Math.floor(Math.random() * moodFeedbacks.length)];
}

// For compatibility with useCoachEvents
export const saveJournalEntry = createJournalEntry;
