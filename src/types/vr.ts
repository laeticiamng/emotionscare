
export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string;
  description: string;
  duration: number | string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  category: string;
  environment?: string;
  emotionTarget?: string;
  thumbnailUrl?: string;
  tags?: string[];
  lastUsed?: Date;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  completed: boolean;
  metadata?: Record<string, any>;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStart: (template: VRSessionTemplate) => void;
  onBack: () => void;
  heartRate?: number;
}
