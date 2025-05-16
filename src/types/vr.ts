
import { MusicTrack } from './music';

export interface VRSessionTemplate {
  id: string;
  title: string;
  description?: string;
  duration: number;
  environment: string;
  musicTrackId?: string;
  musicTrack?: MusicTrack;
  tags?: string[];
  thumbnailUrl?: string;
}

export interface VRSession extends VRSessionTemplate {
  startedAt?: string | Date;
  completedAt?: string | Date;
  userId?: string;
}

export interface VRSessionWithMusicProps {
  sessionId?: string;
  title?: string;
  description?: string;
  duration?: number;
  environment?: string;
  musicTrackId?: string;
}

export interface VRHistoryListProps {
  userId?: string;
}

export interface VRSessionHistoryProps {
  sessionId: string;
}

export interface VRTemplateGridProps {
  onSelect?: (template: VRSessionTemplate) => void;
}
