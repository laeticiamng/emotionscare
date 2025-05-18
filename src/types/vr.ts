
export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string; // Backward compatibility
  description: string;
  duration: number;
  imageUrl: string;
  thumbnailUrl?: string; // Added missing property
  environmentId: string;
  goalType?: 'relaxation' | 'focus' | 'creativity' | 'energy';
  guideType?: 'voice' | 'text' | 'none';
  intensity?: 'light' | 'medium' | 'intense' | number; // Support for legacy number values
  category?: string; // Added missing property
  tags?: string[]; // Added missing property
  objective?: string; // Added missing property
  type?: string; // Added missing property
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
