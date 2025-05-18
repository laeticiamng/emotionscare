
export interface VRSessionTemplate {
  id: string;
  name: string;
  title?: string;
  description: string;
  duration: number;
  tags?: string[];
  category: string;
  thumbnailUrl?: string;
  intensity: number;
  objective: string;
  type: string;
  // Add missing properties that components are using
  audio_url?: string;
  audioTrack?: string;
  is_audio_only?: boolean;
  preview_url?: string;
  benefits?: string[];
  difficulty?: string;
  lastUsed?: Date | string;
  // Additional properties needed for compatibility
  theme?: string;
  imageUrl?: string;
  coverUrl?: string;
  cover_url?: string;
  rating?: number;
  features?: string[];
  popularity?: number;
  completionRate?: number;
  completion_rate?: number;
  recommendedMood?: string;
  recommended_mood?: string;
  emotion?: string;
  immersionLevel?: string;
}

export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  startTime: Date | string;
  endTime?: Date | string;
  duration?: number;
  emotionBefore?: string;
  emotionAfter?: string;
  notes?: string;
  completed?: boolean;
  feedback?: string;
  // Adding missing fields used in components
  startedAt?: Date | string;
  completedAt?: boolean | Date | string;
  date?: Date | string;
  rating?: number;
  heartRateBefore?: number;
  heartRateAfter?: number;
  // Add template reference for convenience
  template?: VRSessionTemplate;
  metrics?: {
    calm?: number;
    focus?: number;
    energy?: number;
    heartRate?: number | number[];
    stressLevel?: number;
    focusLevel?: number;
  };
}

export interface VRSessionWithMusicProps {
  session: VRSession;
  template?: VRSessionTemplate;
  onComplete?: (feedback: string) => void;
  onExit?: () => void;
  // Adding missing properties
  sessionId?: string;
  title?: string;
  description?: string;
  duration?: number;
  environment?: string;
  musicTrackId?: string;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStartSession?: () => void;
  onBack?: () => void;
  heartRate?: number;
  className?: string;
}

export interface VRSessionHistoryProps {
  sessions: VRSession[];
  onSessionSelect?: (session: VRSession) => void;
  userId?: string;
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

// Add definition for Badge which is missing some properties
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  // Additional properties needed
  rarity?: string;
  completed?: boolean;
}

// Add missing conversationId property to ChatMessage interface
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date | string;
  options?: any;
  conversationId?: string;
}

// Add UserNotifications interface with enabled property
export interface UserNotifications {
  email?: boolean;
  push?: boolean;
  sms?: boolean;
  weekly?: boolean;
  insights?: boolean;
  enabled?: boolean;
}
