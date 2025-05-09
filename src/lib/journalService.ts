
import { JournalEntry } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for testing purposes
const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    user_id: 'user1',
    content: "Aujourd'hui a été une journée pleine de défis mais je me sens satisfait d'avoir pu les relever. J'ai eu une réunion difficile mais qui s'est finalement bien passée.",
    date: '2023-11-01',
    title: 'Une journée productive',
    mood: 'content',
    mood_score: 75,
    created_at: '2023-11-01T18:30:00Z',
    ai_feedback: "Il est formidable que vous ayez pu transformer des défis en réussites. Cette résilience est un trait qui vous servira dans toutes les facettes de votre vie.",
    text: "Aujourd'hui a été une journée pleine de défis mais je me sens satisfait d'avoir pu les relever."
  },
  {
    id: '2',
    user_id: 'user1',
    content: "Je me sens un peu stressé par le travail. J'ai beaucoup de deadlines qui approchent et je ne sais pas si je vais pouvoir tout gérer à temps.",
    date: '2023-10-31',
    title: 'Stress au travail',
    mood: 'stressed',
    mood_score: 30,
    created_at: '2023-10-31T15:00:00Z',
    ai_feedback: "Il est normal de se sentir stressé face à des échéances. Essayez de prioriser vos tâches et de vous concentrer sur une chose à la fois. N'hésitez pas à demander de l'aide si vous en avez besoin.",
    text: "Je me sens un peu stressé par le travail. J'ai beaucoup de deadlines qui approchent et je ne sais pas si je vais pouvoir tout gérer à temps."
  },
  {
    id: '3',
    user_id: 'user2',
    content: "J'ai passé une excellente journée avec ma famille. Nous sommes allés au parc et avons fait un pique-nique. Les enfants étaient très heureux.",
    date: '2023-10-30',
    title: 'Journée en famille',
    mood: 'joyful',
    mood_score: 90,
    created_at: '2023-10-30T20:00:00Z',
    ai_feedback: "Les moments passés en famille sont précieux. Continuez à cultiver ces relations et à profiter de ces instants de bonheur.",
    text: "J'ai passé une excellente journée avec ma famille. Nous sommes allés au parc et avons fait un pique-nique. Les enfants étaient très heureux."
  },
  {
    id: '4',
    user_id: 'user2',
    content: "Je me suis disputé avec mon partenaire. Je suis très triste et en colère. J'ai besoin de temps pour moi.",
    date: '2023-10-29',
    title: 'Dispute',
    mood: 'sad',
    mood_score: 20,
    created_at: '2023-10-29T12:00:00Z',
    ai_feedback: "Les disputes sont difficiles. Prenez le temps de vous calmer et de réfléchir à ce qui s'est passé. Essayez de communiquer avec votre partenaire de manière constructive.",
    text: "Je me suis disputé avec mon partenaire. Je suis très triste et en colère. J'ai besoin de temps pour moi."
  },
];

// Function to fetch journal entries
export const fetchJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // In a real app, we would filter by user_id
  return mockJournalEntries.filter(entry => entry.user_id === userId);
};

// Helper function to generate a unique ID
const generateId = (): string => uuidv4();

// Function to create a new journal entry
export const createJournalEntry = async (entry: Partial<JournalEntry>): Promise<JournalEntry> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newEntry: JournalEntry = {
    id: generateId(),
    user_id: entry.user_id || 'user1',
    content: entry.content || '',
    title: entry.title || 'Sans titre',
    mood: entry.mood || 'neutral',
    mood_score: entry.mood_score || 50,
    created_at: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    text: entry.text || '',
    ai_feedback: entry.ai_feedback || ''
  };

  return newEntry;
};

// Function to update an existing journal entry
export const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>): Promise<JournalEntry> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Retrieve existing entry (in a real scenario, this would come from a database)
  const existingEntry = mockJournalEntries.find(entry => entry.id === id);

  if (!existingEntry) {
    throw new Error(`Journal entry with id ${id} not found`);
  }

  const updatedEntry = {
    ...existingEntry,
    ...updates,
    mood_score: updates.mood_score || existingEntry.mood_score || 50,
  };

  return updatedEntry;
};

// Function to delete a journal entry
export const deleteJournalEntry = async (id: string): Promise<void> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real scenario, this would remove the entry from a database
  console.log(`Journal entry with id ${id} deleted`);
};
