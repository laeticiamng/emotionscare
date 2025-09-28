import { create } from 'zustand';

export type MoodBucket = 'clear' | 'mixed' | 'pressured';
export type JournalMode = 'voice' | 'text';

export interface JournalEntry {
  entry_id: string;
  created_at: string;
  mode: JournalMode;
  mood_bucket: MoodBucket;
  summary: string;
  suggestion?: string;
  transcript_url?: string;
  media_url?: string;
}

interface JournalStore {
  recording: boolean;
  uploading: boolean;
  currentEntry?: JournalEntry;
  entries: JournalEntry[];
  searchQuery: string;
  setRecording: (recording: boolean) => void;
  setUploading: (uploading: boolean) => void;
  setCurrentEntry: (entry?: JournalEntry) => void;
  addEntry: (entry: JournalEntry) => void;
  setEntries: (entries: JournalEntry[]) => void;
  setSearchQuery: (query: string) => void;
}

export const useJournalStore = create<JournalStore>((set) => ({
  recording: false,
  uploading: false,
  entries: [],
  searchQuery: '',
  setRecording: (recording) => set({ recording }),
  setUploading: (uploading) => set({ uploading }),
  setCurrentEntry: (currentEntry) => set({ currentEntry }),
  addEntry: (entry) =>
    set((state) => ({
      entries: [entry, ...state.entries],
    })),
  setEntries: (entries) => set({ entries }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));