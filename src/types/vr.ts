
export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string; // Backward compatibility
  description: string;
  duration: number;
  imageUrl: string;
  thumbnailUrl?: string;
  environmentId: string;
  goalType?: 'relaxation' | 'focus' | 'creativity' | 'energy';
  guideType?: 'voice' | 'text' | 'none';
  intensity?: 'light' | 'medium' | 'intense' | number;
  category?: string;
  tags?: string[];
  objective?: string;
  type?: string;
  audio_url?: string;
  audioTrack?: string;
  preview_url?: string;
  is_audio_only?: boolean;
  benefits?: string[];
  difficulty?: string;
  lastUsed?: Date | string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  metrics: VRSessionMetrics;
  completed?: boolean;
  completedAt?: Date | string;
  heartRateBefore?: number;
  heartRateAfter?: number;
  feedback?: string;
  rating?: number;
  startedAt?: Date | string;
  date?: Date | string;
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

export interface VRSessionHistoryProps {
  sessions: VRSession[];
  onSelect?: (session: VRSession) => void;
}
