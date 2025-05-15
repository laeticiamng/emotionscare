
import { MusicTrack, MusicPlaylist } from './music';
import { Emotion } from './emotion';

export interface VRSessionTemplate {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  image?: string;
  videoUrl?: string;
  audioUrl?: string;
  tags?: string[];
  benefits?: string[];
  is_audio_only?: boolean;
  difficulty?: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  category?: string;
  emotion?: string;
  preview_url?: string;
  audio_url?: string;
  video_url?: string;
  thumbnail?: string;
}

export interface VRSession {
  id: string;
  template_id: string;
  user_id: string;
  start_time: Date | string;
  end_time?: Date | string;
  duration: number;
  completed: boolean;
  emotion_before?: Emotion | string;
  emotion_after?: Emotion | string;
  notes?: string;
  rating?: number;
  template?: VRSessionTemplate;
  videoUrl?: string;
  audioUrl?: string;
  title?: string;
  description?: string;
  tags?: string[];
  benefits?: string[];
  is_audio_only?: boolean;
  difficulty?: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  category?: string;
  emotion?: string;
  preview_url?: string;
  audio_url?: string;
  video_url?: string;
}

export interface VRHistoryListProps {
  sessions: VRSession[];
  onSessionClick?: (session: VRSession) => void;
}

export interface VRSessionWithMusicProps {
  session: VRSession;
  onComplete?: () => void;
  playlist?: MusicPlaylist;
}

export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onTemplateSelect: (template: VRSessionTemplate) => void;
  featuredOnly?: boolean;
}

export interface VRSessionWithMusicPropsType {
  session: VRSession;
  onComplete?: () => void;
  playlist?: MusicPlaylist;
}

export interface VRSessionHistoryProps {
  userId?: string;
  limit?: number;
  showHeading?: boolean;
}

export interface VoiceEmotionScannerProps {
  onResult?: (result: any) => void;
  autoStart?: boolean;
  duration?: number;
}

export interface LiveVoiceScannerProps {
  onResult?: (result: any) => void;
  autoStart?: boolean;
  duration?: number;
}
