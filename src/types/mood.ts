
export interface MoodData {
  date: string | Date;
  value: number;
  label?: string;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}
