
export interface MoodData {
  id: string;
  user_id: string;
  date: string | Date;
  mood: string;
  score: number;
  notes?: string;
  triggers?: string[];
  activities?: string[];
  created_at: string | Date;
}
