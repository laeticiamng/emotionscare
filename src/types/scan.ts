
// Update TeamOverviewProps to include all required properties
export interface TeamOverviewProps {
  userId?: string;
  period?: string;
  anonymized?: boolean;
  className?: string;
  dateRange?: [Date, Date];
  users?: any[];
  showNames?: boolean;
  compact?: boolean;
}

export interface EmotionResult {
  id?: string;
  userId?: string;
  user_id?: string; // Added for compatibility
  emotion?: string;
  intensity?: number;
  timestamp?: string | Date;
  source?: string;
  context?: string;
  tags?: string[];
  notes?: string;
  category?: string;
  score?: number;
  feedback?: string;
  ai_feedback?: string;
  confidence?: number;
  recommendations?: string[];
}
