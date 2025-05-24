
export interface Emotion {
  name: string;
  intensity: number;
}

export interface EmotionResult {
  emotions: Emotion[];
  confidence: number;
  timestamp: Date;
  recommendations?: string;
  analysisType: 'text' | 'audio' | 'emoji';
}

export interface EmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}
