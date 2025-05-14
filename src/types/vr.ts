export interface VRSessionTemplate {
  id: string;
  name: string;
  title?: string; // Added to fix error
  description: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  tags: string[];
  image?: string;
  previewUrl?: string;
  category?: string;
}

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  start_time: Date;
  end_time?: Date;
  notes?: string;
  rating?: number;
  completed: boolean;
  custom_fields?: Record<string, any>;
}

export interface VRHistoryListProps {
  sessions: VRSession[];
  onSessionClick: (session: VRSession) => void;
}
