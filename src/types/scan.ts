
import { EmotionResult } from './emotion';

export type ScanType = 'text' | 'facial' | 'audio' | 'manual';

export interface ScanResult {
  id: string;
  timestamp: string;
  type: ScanType;
  emotions: EmotionResult;
  userId?: string;
  notes?: string;
}

export interface ScanHistoryItem {
  id: string;
  date: string;
  emotion: string;
  intensity: number;
  source: ScanType;
}

export { EmotionResult };
