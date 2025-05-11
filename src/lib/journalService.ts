
import { v4 as uuidv4 } from 'uuid';
import { JournalEntry } from '@/types';

// Entrées de journal simulées
let journalEntries: JournalEntry[] = [
  {
    id: '1',
    content: 'Journée difficile avec beaucoup de pression au travail.',
    emotion: 'stressed',
    mood_score: 3,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'user-1',
    text: 'Journée difficile avec beaucoup de pression au travail.' // Pour compatibility
  },
  {
    id: '2',
    content: 'Superbe journée à la plage avec les amis. Très reposant!',
    emotion: 'happy',
    mood_score: 8,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'user-1',
    text: 'Superbe journée à la plage avec les amis. Très reposant!' // Pour compatibility
  },
];

/**
 * Récupérer toutes les entrées de journal pour un utilisateur spécifique
 */
export const getJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  return journalEntries.filter(entry => entry.user_id === userId);
};

// Exporter avec un alias pour la compatibilité en amont
export const fetchJournalEntries = getJournalEntries;

/**
 * Récupérer une entrée de journal spécifique par ID
 */
export const getJournalEntryById = async (entryId: string): Promise<JournalEntry | undefined> => {
  return journalEntries.find(entry => entry.id === entryId);
};

/**
 * Créer une nouvelle entrée de journal
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
 * Mettre à jour une entrée de journal existante
 */
export const updateJournalEntry = async (entryId: string, entryData: Partial<JournalEntry>): Promise<JournalEntry | undefined> => {
  const index = journalEntries.findIndex(entry => entry.id === entryId);
  if (index === -1) return undefined;
  
  journalEntries[index] = {
    ...journalEntries[index],
    ...entryData,
    text: entryData.content || journalEntries[index].text // Pour compatibility
  };
  
  return journalEntries[index];
};

/**
 * Supprimer une entrée de journal par ID
 */
export const deleteJournalEntry = async (entryId: string): Promise<boolean> => {
  const initialLength = journalEntries.length;
  journalEntries = journalEntries.filter(entry => entry.id !== entryId);
  return journalEntries.length < initialLength;
};

/**
 * Sauvegarder une entrée de journal (créer ou mettre à jour)
 */
export const saveJournalEntry = async (entryData: any): Promise<JournalEntry> => {
  if (entryData.id) {
    const updated = await updateJournalEntry(entryData.id, entryData);
    if (updated) return updated;
  }
  
  return createJournalEntry(entryData as Omit<JournalEntry, 'id'>);
};
