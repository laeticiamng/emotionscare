
// Add this to your existing scan.ts file or create it if it doesn't exist

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
  // Define your emotion result type here
  id?: string;
  userId?: string;
  emotion?: string;
  intensity?: number;
  timestamp?: string | Date;
  source?: string;
  context?: string;
  tags?: string[];
  notes?: string;
  category?: string;
}
