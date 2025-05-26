
export interface VRSessionTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  thumbnail?: string;
  preview?: string;
}

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStart: (template: VRSessionTemplate) => void;
  onBack: () => void;
  heartRate?: number;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  completed: boolean;
}
