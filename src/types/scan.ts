
export interface ScanResult {
  id: string;
  user_id: string;
  timestamp: Date | string;
  emotion_data: any;
  confidence_score: number;
}
