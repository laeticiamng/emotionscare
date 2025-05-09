
import { v4 as uuidv4 } from 'uuid';
import { JournalEntry } from '@/types';

// Mock journal entries
let journalEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'Jour de stress',
    content: 'Journée difficile avec beaucoup de pression au travail.',
    mood: 'stressed',
    mood_score: 3,
    categories: ['work', 'stress'],
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'user-1',
  },
  {
    id: '2',
    title: 'Détente à la plage',
    content: 'Superbe journée à la plage avec les amis. Très reposant!',
    mood: 'happy',
    mood_score: 8,
    categories: ['leisure', 'friends'],
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'user-1',
  },
];

/**
 * Get all journal entries for a specific user
 */
export const getJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  return journalEntries.filter(entry => entry.user_id === userId);
};

/**
 * Get a specific journal entry by ID
 */
export const getJournalEntryById = async (entryId: string): Promise<JournalEntry | undefined> => {
  return journalEntries.find(entry => entry.id === entryId);
};

/**
 * Create a new journal entry
 */
export const createJournalEntry = async (entryData: Omit<JournalEntry, 'id'>): Promise<JournalEntry> => {
  const newEntry: JournalEntry = {
    id: uuidv4(),
    ...entryData,
    date: entryData.date || new Date().toISOString()
  };
  
  journalEntries.push(newEntry);
  return newEntry;
};

/**
 * Update an existing journal entry
 */
export const updateJournalEntry = async (entryId: string, entryData: Partial<JournalEntry>): Promise<JournalEntry | undefined> => {
  const index = journalEntries.findIndex(entry => entry.id === entryId);
  if (index === -1) return undefined;
  
  journalEntries[index] = {
    ...journalEntries[index],
    ...entryData
  };
  
  return journalEntries[index];
};

/**
 * Delete a journal entry by ID
 */
export const deleteJournalEntry = async (entryId: string): Promise<boolean> => {
  const initialLength = journalEntries.length;
  journalEntries = journalEntries.filter(entry => entry.id !== entryId);
  return journalEntries.length < initialLength;
};

/**
 * Save a journal entry (create or update)
 */
export const saveJournalEntry = async (entryData: any): Promise<JournalEntry> => {
  if (entryData.id) {
    const updated = await updateJournalEntry(entryData.id, entryData);
    if (updated) return updated;
  }
  
  return createJournalEntry(entryData as Omit<JournalEntry, 'id'>);
};
