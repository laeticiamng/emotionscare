
// Types for emotion detection results
export interface EmotionResult {
  id: string;
  emotion: string;
  score: number;
  confidence: number;
  text?: string;
  feedback?: string;
  intensity?: number;
  timestamp?: string;
  date?: string;
  recommendations?: string[];
  emojis?: string[];
  userId?: string;
  user_id?: string;
  transcript?: string;
  ai_feedback?: string;
  source?: string; // Ajouté pour résoudre les erreurs
}

export interface EmotionStats {
  emotion: string;
  count: number;
  percentage: number;
}

export interface EmotionTrend {
  date: string;
  emotion: string;
  value: number;
}

export interface EmotionTimelineEntry {
  id: string;
  date: string;
  emotion: string;
  intensity: number;
  note?: string;
}

export type EmotionIntensity = 'low' | 'medium' | 'high';

// Ajout du type Emotion manquant
export interface Emotion {
  id: string;
  name: string;
  color: string;
  emoji?: string;
  intensity?: EmotionIntensity;
  description?: string;
}

// Update EmotionalTeamViewProps with all the properties used in the component
export interface EmotionalTeamViewProps {
  teamId?: string;
  period?: 'day' | 'week' | 'month';
  view?: 'chart' | 'grid' | 'list';
  anonymized?: boolean;
  dateRange?: Date[];
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}

// Ajout pour une interface EmotionalData manquante dans certains imports
export interface EmotionalData {
  id: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  user_id?: string;
  notes?: string;
}

// Interfaces pour les fonctionnalités du scanner
export interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  autoStart?: boolean;
  scanDuration?: number;
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  showMembers?: boolean;
}
