
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
  audio_url?: string; // Added for backward compatibility
  audioTrack?: string; // Added for backward compatibility
  preview_url?: string; // Added for backward compatibility
  is_audio_only?: boolean; // Added for backward compatibility
  benefits?: string[]; // Added for backward compatibility
  difficulty?: string; // Added for backward compatibility
  lastUsed?: Date | string; // Added for backward compatibility
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  metrics: VRSessionMetrics;
  completed?: boolean; // Added for backward compatibility
  completedAt?: Date | string; // Added for backward compatibility
  heartRateBefore?: number; // Added for backward compatibility
  heartRateAfter?: number; // Added for backward compatibility
  feedback?: string; // Added for backward compatibility
  rating?: number; // Added for backward compatibility
  startedAt?: Date | string; // Added for backward compatibility
  date?: Date | string; // Added for backward compatibility
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
  emptyMessage?: string;
  limitDisplay?: number;
}

export interface VRSessionWithMusicProps {
  sessionTemplate: VRSessionTemplate;
  onComplete?: () => void;
}
