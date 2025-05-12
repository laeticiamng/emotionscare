
import { JournalEntry } from '@/types';

// Mock database of journal entries
let journalEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'Une bonne journée',
    content: 'Aujourd\'hui était une excellente journée. J\'ai accompli beaucoup de choses et je me sens bien.',
    mood: 'happy',
    mood_score: 85,
    emotion: 'joy',
    date: new Date().toISOString(),
    user_id: 'user1',
    tags: ['productif', 'heureux']
  },
  {
    id: '2',
    title: 'Journée stressante',
    content: 'Beaucoup de pression au travail aujourd\'hui. Je me sens un peu dépassé mais je gère.',
    mood: 'stressed',
    mood_score: 40,
    emotion: 'stressed',
    date: new Date(Date.now() - 86400000).toISOString(),
    user_id: 'user1',
    tags: ['travail', 'stress']
  }
];

// Get all journal entries
export const getJournalEntries = async (user_id: string): Promise<JournalEntry[]> => {
  // Filter by user_id in a real app
  return journalEntries;
};

// Get a single journal entry
export const getJournalEntry = async (id: string): Promise<JournalEntry | null> => {
  const entry = journalEntries.find(e => e.id === id);
  return entry || null;
};

// Create a new journal entry
export const createJournalEntry = async (entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> => {
  const newEntry: JournalEntry = {
    ...entry,
    id: Math.random().toString(36).substring(2, 9),
    date: entry.date || new Date().toISOString()
  };
  
  journalEntries.unshift(newEntry);
  return newEntry;
};

// Update a journal entry
export const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | null> => {
  const index = journalEntries.findIndex(e => e.id === id);
  
  if (index === -1) return null;
  
  const updatedEntry = {
    ...journalEntries[index],
    ...updates
  };
  
  journalEntries[index] = updatedEntry;
  return updatedEntry;
};

// Delete a journal entry
export const deleteJournalEntry = async (id: string): Promise<boolean> => {
  const initialLength = journalEntries.length;
  journalEntries = journalEntries.filter(e => e.id !== id);
  return journalEntries.length < initialLength;
};

// Get AI feedback for an entry
export const getAIFeedback = async (content: string): Promise<string> => {
  // This would be an API call to an AI service in a real app
  return "Based on your entry, you seem to be handling stress well. Consider taking short breaks during work hours to maintain your energy levels.";
};
