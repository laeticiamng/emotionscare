
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  created_at: string | Date;
  updated_at: string | Date;
  user_id: string;
  mood?: number;
  emotion?: string;
  tags?: string[];
  is_private?: boolean;
  metadata?: {
    location?: string;
    weather?: string;
    activity?: string;
    [key: string]: any;
  };
}
