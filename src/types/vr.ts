
export interface VRSession {
  id: string;
  user_id: string;
  template_id?: string;
  started_at: string | Date;
  ended_at?: string | Date;
  duration?: number;
  emotions?: string[];
  completed: boolean;
  notes?: string;
  rating?: number;
  title?: string;
}

export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  duration?: number;
  category?: string;
  guided?: boolean;
  voice?: string;
  music_included?: boolean;
  difficulty?: string;
  emotions?: string[]; // Added emotions property
}

export interface VRSessionWithMusicProps {
  session?: VRSession;
  template?: VRSessionTemplate;
  onComplete?: (feedback: any) => void;
  autoStart?: boolean;
}
