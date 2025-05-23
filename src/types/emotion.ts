
export interface EmotionResult {
  id?: string;
  date?: string;
  score: number;
  primaryEmotion?: string;
  emotions?: Record<string, number>;
  text?: string;
  audio?: string;
  aiFeedback?: string;
}

export interface EmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onClose: () => void;
}

export interface TextEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel: () => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

export interface AudioEmotionScannerProps extends TextEmotionScannerProps {}
export interface EmojiEmotionScannerProps extends TextEmotionScannerProps {}
