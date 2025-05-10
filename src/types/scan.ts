
// Define basic types for the scan functionality
export interface ScanResult {
  id: string;
  user_id: string;
  type: 'emotion' | 'stress' | 'focus';
  score: number;
  created_at: Date | string;
  details?: Record<string, any>;
}

export interface ScanHistory {
  results: ScanResult[];
  average: number;
  trend: 'improving' | 'declining' | 'stable';
  recommendations?: string[];
}

export interface EnhancedEmotionResult {
  emotion: string;
  confidence: number;
  feedback?: string;
  recommendations?: string[];
  transcript?: string;
}
