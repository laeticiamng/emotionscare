
import { JournalEntry } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Simulate local storage persistence
const STORAGE_KEY = 'emotions_care_journal';

// Load journal entries from local storage
export const getJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const allEntries = JSON.parse(storedData) as JournalEntry[];
      return allEntries.filter(entry => entry.user_id === userId);
    }
    return [];
  } catch (error) {
    console.error('Error loading journal entries:', error);
    return [];
  }
};

// Add a new journal entry
export const addJournalEntry = async (entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    const existingEntries = storedData ? JSON.parse(storedData) as JournalEntry[] : [];
    
    const newEntry: JournalEntry = {
      ...entry,
      id: uuidv4(),
      date: entry.date || new Date().toISOString()
    };
    
    const updatedEntries = [...existingEntries, newEntry];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    
    return newEntry;
  } catch (error) {
    console.error('Error adding journal entry:', error);
    throw new Error('Failed to add journal entry');
  }
};

// Update an existing journal entry
export const updateJournalEntry = async (entry: JournalEntry): Promise<JournalEntry> => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      throw new Error('No journal entries found');
    }
    
    const existingEntries = JSON.parse(storedData) as JournalEntry[];
    const entryIndex = existingEntries.findIndex(e => e.id === entry.id);
    
    if (entryIndex === -1) {
      throw new Error('Journal entry not found');
    }
    
    existingEntries[entryIndex] = entry;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingEntries));
    
    return entry;
  } catch (error) {
    console.error('Error updating journal entry:', error);
    throw new Error('Failed to update journal entry');
  }
};

// Delete a journal entry
export const deleteJournalEntry = async (entryId: string): Promise<void> => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return;
    }
    
    const existingEntries = JSON.parse(storedData) as JournalEntry[];
    const updatedEntries = existingEntries.filter(e => e.id !== entryId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    throw new Error('Failed to delete journal entry');
  }
};

// Get a single journal entry by ID
export const getJournalEntryById = async (entryId: string): Promise<JournalEntry | null> => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return null;
    }
    
    const entries = JSON.parse(storedData) as JournalEntry[];
    const entry = entries.find(e => e.id === entryId);
    
    return entry || null;
  } catch (error) {
    console.error('Error getting journal entry:', error);
    return null;
  }
};
