
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
  title?: string;
  mood?: string;
}

export interface JournalPrompt {
  id: string;
  text: string;
  category: string;
  emotion_target?: string;
  difficulty?: 'easy' | 'medium' | 'deep';
  time_estimate?: number;
}

export interface JournalEntryAnalysis {
  entry_id: string;
  sentiment_score: number;
  emotions_detected: Record<string, number>;
  keywords: string[];
  themes: string[];
  insights?: string[];
  recommendations?: string[];
}

export interface JournalSettings {
  auto_analysis: boolean;
  emotion_tracking: boolean;
  reminders: boolean;
  reminder_time?: string;
  privacy_level: 'private' | 'anonymous' | 'shared';
}
