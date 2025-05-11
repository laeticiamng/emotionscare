
export interface JournalEntry {
  id: string;
  user_id: string;
  date: string | Date;
  content: string;
  text?: string;
  emotion?: string;
  mood_score?: number;
  tags?: string[];
  ai_feedback?: string;
  title?: string; // Added for JournalEntryPage.tsx
  mood?: string;  // Added for JournalEntryPage.tsx
}

export interface JournalPrompt {
  id: string;
  text: string;
  type: string;
  emotion?: string;
  category?: string;
  difficulty?: string;
}

export interface JournalMetadata {
  totalEntries: number;
  lastEntryDate?: string;
  topEmotions: string[];
  streakCount: number;
  completionRate: number;
}
