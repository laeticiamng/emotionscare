
export interface EmotionData {
  emotion: string;
  confidence: number;
  intensity?: number;
  valence?: number;
  arousal?: number;
  dominance?: number;
  timestamp?: string;
}

export interface EmotionResult {
  emotion: string;
  intensity: number;
  confidence: number;
  data?: EmotionData[];
  timestamp?: string;
  source?: string;
  language?: string;
  text?: string;
  feedback?: string;
  recommendations?: EmotionRecommendation[];
  triggers?: string[];
  context?: object;
  model?: string;
  raw?: any;
  ai_feedback?: string;
}

export interface EmotionRecommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  emotion: string;
  content: string;
  category: string;
}

export interface EmotionTrigger {
  name: string;
  description: string;
  intensity: number;
  emotion: string;
  timestamp: string;
  context?: string;
  tags?: string[];
}

export interface EmotionReport {
  id: string;
  userId: string;
  date: string;
  emotions: EmotionData[];
  dominantEmotion: string;
  averageIntensity: number;
  triggers?: EmotionTrigger[];
  recommendations?: EmotionRecommendation[];
  notes?: string;
  tags?: string[];
}

export interface EmotionChartData {
  name: string;
  value: number;
  color?: string;
}

export interface EmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  initialTab?: 'emoji' | 'text' | 'facial' | 'voice';
}

export interface EmotionScanResult {
  emotion: string;
  intensity: number;
  confidence: number;
  timestamp: string;
  source: "text" | "voice" | "facial" | "emoji" | "system" | "ai";
  recommendations?: string[];
}

export interface EmotionScanFormProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  onClose?: () => void;
}
