
/**
 * Types partagés pour le module de musique
 */

// Interface de base pour une piste musicale
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  duration?: number;
  coverUrl?: string;
  audioUrl?: string;
  mood?: string[];
  isLiked?: boolean;
}

// Interface pour une playlist musicale
export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  mood?: string;
  isCustom?: boolean;
}

// Interface pour les paramètres de music par émotion
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  tempo?: number;
}

// Interface pour les paramètres du player musical
export interface MusicPlayerProps {
  track: MusicTrack | null;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onEnded?: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  className?: string;
}

// Interface pour les préférences musicales de l'utilisateur
export interface MusicPreferences {
  volume: number;
  autoplay: boolean;
  crossfade: boolean;
  equalizer: {
    bass: number;
    mid: number;
    treble: number;
  };
  favorites: string[];
}

// Interface pour une session musicale
export interface MusicSession {
  id: string;
  startTime: string;
  endTime?: string;
  tracks: string[];
  totalDuration: number;
  emotion?: string;
  feedback?: number;
}

// Interface pour les paramètres d'humeur musicale
export interface MusicMood {
  name: string;
  description: string;
  color: string;
  icon: string;
  intensity: number;
  bpm: number[];
}
