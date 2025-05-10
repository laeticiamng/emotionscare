
export interface MoodData {
  date: string | Date;
  value: number;
  emotion?: string;
  notes?: string;
  id?: string;
  user_id?: string;
  originalDate?: string | Date;
  
  // Add chart properties
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}
