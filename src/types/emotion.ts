
export interface EmotionResult {
  score: number;
  primaryEmotion: string;
  secondaryEmotions?: string[];
  stressLevel?: 'low' | 'medium' | 'high';
  aiFeedback?: string;
  recommendations?: string[];
  immediateActions?: string[];
  timestamp: Date;
  method: 'text' | 'audio' | 'emoji' | 'facial';
  rawData?: {
    emojis?: string[];
    text?: string;
    audioUrl?: string;
    facialExpression?: string;
  };
}

export interface EmotionScanConfig {
  enabledMethods: ('text' | 'audio' | 'emoji' | 'facial')[];
  aiModelConfig: {
    model: string;
    temperature: number;
  };
}

export interface EmotionHistory {
  id: string;
  userId: string;
  result: EmotionResult;
  createdAt: Date;
  updatedAt: Date;
}
