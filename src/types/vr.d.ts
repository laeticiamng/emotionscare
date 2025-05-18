
export interface VRSessionTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  sessionType: VRSessionType;
  thumbnailUrl?: string;
  intensity: string;
  effects?: VREffect[];
  categories?: string[];
  status?: 'published' | 'draft' | 'archived';
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  rating?: number;
  userCount?: number;
  isFeatured?: boolean;
  isPublic?: boolean;
  thumbnail?: string; // Pour compatibilité (alias de thumbnailUrl)
}

export type VRSessionType = 
  | 'relaxation' 
  | 'meditation' 
  | 'focus' 
  | 'creativity' 
  | 'therapy' 
  | 'nature' 
  | 'immersive' 
  | 'educational' 
  | 'custom';

export interface VREffect {
  id: string;
  name: string;
  description?: string;
  type: 'visual' | 'audio' | 'haptic' | 'mixed';
  intensity: number;
  startTime?: number;
  duration?: number;
  parameters?: Record<string, any>;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  emotionsBefore?: Record<string, number>;
  emotionsAfter?: Record<string, number>;
  feedback?: string;
  rating?: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
}

export interface VRStats {
  totalSessions: number;
  totalDuration: number;
  averageRating: number;
  emotionImpact: {
    before: Record<string, number>;
    after: Record<string, number>;
  };
  mostUsedTemplates: {
    templateId: string;
    name: string;
    count: number;
  }[];
}

export interface VRContextType {
  currentSession: VRSession | null;
  availableTemplates: VRSessionTemplate[];
  startSession: (templateId: string) => Promise<VRSession | null>;
  endSession: (feedback?: string, rating?: number) => Promise<boolean>;
  loadTemplates: () => Promise<VRSessionTemplate[]>;
  getTemplateById: (id: string) => VRSessionTemplate | null;
  getUserStats: () => Promise<VRStats | null>;
  isVRSupported: boolean;
  isVRActive: boolean;
  error: Error | null;
}
