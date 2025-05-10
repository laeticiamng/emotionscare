
export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  started_at: string | Date;
  ended_at?: string | Date;
  duration: number;
  completed: boolean;
  emotional_state_before?: string;
  emotional_state_after?: string;
  emotional_score_before?: number;
  emotional_score_after?: number;
  notes?: string;
  template?: VRSessionTemplate;
}

export interface VRSessionTemplate {
  id: string;
  template_id: string;
  title: string;
  theme: string;
  description: string;
  duration: number;
  preview_url: string;
  is_audio_only?: boolean;
  category: string;
  benefits: string[];
  emotions: string[];
  popularity?: number;
  audio_url?: string;
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete?: (session: VRSession) => void;
  onExit?: () => void;
  initialTrack?: MusicTrack;
}
