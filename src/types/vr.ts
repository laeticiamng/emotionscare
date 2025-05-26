
export interface VRSessionTemplate {
  id: string;
  title: string;
  name?: string;
  description: string;
  duration: number | string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: 'meditation' | 'relaxation' | 'focus' | 'therapy';
  environment: string;
  thumbnailUrl?: string;
  tags?: string[];
  emotionTarget?: string;
  lastUsed?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  startTime: string;
  endTime?: string;
  completed: boolean;
  heartRate?: number;
  emotionalState?: string;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStart: (template: VRSessionTemplate) => void;
  onBack: () => void;
  heartRate?: number;
}
