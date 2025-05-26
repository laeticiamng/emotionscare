
export interface VRSessionTemplate {
  id: string;
  name?: string;
  title?: string;
  description: string;
  duration: number;
  environment: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  backgroundMusic?: string;
  instructions?: string[];
  lastUsed?: string;
  isActive?: boolean;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  progress: number;
  settings: {
    musicEnabled: boolean;
    backgroundMusic?: string;
    volume: number;
  };
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStart: (template: VRSessionTemplate) => void;
  onBack: () => void;
  heartRate?: number;
}
