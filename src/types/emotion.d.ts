
export interface EmotionResult {
  id: string;
  emotion: string;
  score?: number;
  confidence: number;
  timestamp: string;
  date?: string;
  feedback?: string;
  source?: string;
  text?: string;
  audioUrl?: string;
}

export interface LiveVoiceScannerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  autoStart?: boolean;
  showFeedback?: boolean;
}

export interface TeamOverviewProps {
  teamId: string;
}

export interface EmotionalTeamViewProps {
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
    emotionResult?: EmotionResult;
  }>;
}

export type Emotion = 
  | 'joy' 
  | 'sadness' 
  | 'anger' 
  | 'fear' 
  | 'disgust' 
  | 'surprise' 
  | 'neutral'
  | 'calm'
  | 'anxiety'
  | 'excitement'
  | 'confidence'
  | 'focus';
