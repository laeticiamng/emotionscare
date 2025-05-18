
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  imageUrl: string;
  environmentId: string;
  goalType?: 'relaxation' | 'focus' | 'creativity' | 'energy';
  guideType?: 'voice' | 'text' | 'none';
  intensity?: 'light' | 'medium' | 'intense';
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  metrics: VRSessionMetrics;
}

export interface VRSessionMetrics {
  heartRateAvg?: number;
  heartRateStart?: number;
  heartRateEnd?: number;
  emotionStart?: string;
  emotionEnd?: string;
  focusScore?: number;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  heartRate: number;
  onBack: () => void;
  onStartSession?: () => void;
}
