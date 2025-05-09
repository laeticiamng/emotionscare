
import { JournalEntry } from '@/types';

// Mock journal entries
let mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    user_id: 'user-1',
    title: 'Première journée de travail',
    content: 'Aujourd\'hui était ma première journée dans ma nouvelle entreprise. J\'étais nerveux mais tout s\'est bien passé.',
    date: '2023-05-01T10:30:00Z',
    mood: 'happy',
    created_at: '2023-05-01T19:30:00Z',
    mood_score: 80
  },
  {
    id: '2',
    user_id: 'user-1',
    title: 'Session VR relaxante',
    content: 'J\'ai essayé une nouvelle session VR aujourd\'hui et je me sens vraiment détendu maintenant.',
    date: '2023-05-03T14:15:00Z',
    mood: 'calm',
    created_at: '2023-05-03T20:45:00Z',
    mood_score: 75
  },
  {
    id: '3',
    user_id: 'user-1',
    title: 'Journée stressante',
    content: 'Beaucoup de réunions aujourd\'hui et une présentation importante. Je me sens un peu stressé.',
    date: '2023-05-05T18:20:00Z',
    mood: 'anxious',
    created_at: '2023-05-05T21:30:00Z',
    mood_score: 45
  }
];

// Fetch all journal entries
export const fetchJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockJournalEntries.filter(entry => entry.user_id === userId);
};

// Fetch a specific journal entry
export const fetchJournalEntry = async (id: string): Promise<JournalEntry> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const entry = mockJournalEntries.find(entry => entry.id === id);
  if (!entry) {
    throw new Error('Journal entry not found');
  }

  return entry;
};

// Create a new journal entry
export const createJournalEntry = async (entryData: Partial<JournalEntry>): Promise<JournalEntry> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));

  const newEntry: JournalEntry = {
    id: `entry-${Date.now()}`,
    user_id: entryData.user_id || 'user-1', // Default user ID
    title: entryData.title || 'Sans titre',
    content: entryData.content || '',
    date: entryData.date || new Date().toISOString(),
    mood: entryData.mood || 'neutral',
    created_at: new Date().toISOString(),
    mood_score: entryData.mood_score || 50
  };

  mockJournalEntries.push(newEntry);
  return newEntry;
};

// Update an existing journal entry
export const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>): Promise<JournalEntry> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const index = mockJournalEntries.findIndex(entry => entry.id === id);
  if (index === -1) {
    throw new Error('Journal entry not found');
  }

  mockJournalEntries[index] = {
    ...mockJournalEntries[index],
    ...updates,
    // Don't update these fields
    id: mockJournalEntries[index].id,
    user_id: mockJournalEntries[index].user_id,
    created_at: mockJournalEntries[index].created_at
  };

  return mockJournalEntries[index];
};

// Delete a journal entry
export const deleteJournalEntry = async (id: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));

  const initialLength = mockJournalEntries.length;
  mockJournalEntries = mockJournalEntries.filter(entry => entry.id !== id);

  return mockJournalEntries.length < initialLength;
};

// Save journal entry (alias for createJournalEntry for backward compatibility)
export const saveJournalEntry = createJournalEntry;
