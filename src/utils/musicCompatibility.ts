import { MusicTrack } from '@/types/music';

// Assure qu'une valeur est un tableau
export const ensureArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

// Validation d'un track musical
export const validateMusicTrack = (track: any): track is MusicTrack => {
  return (
    track &&
    typeof track.id === 'string' &&
    typeof track.title === 'string' &&
    typeof track.artist === 'string' &&
    (typeof track.url === 'string' || typeof track.audioUrl === 'string') &&
    typeof track.duration === 'number' &&
    track.duration > 0
  );
};

// Normalise un track pour compatibilité
export const normalizeMusicTrack = (track: any): MusicTrack | null => {
  if (!track) return null;

  try {
    const normalized: MusicTrack = {
      id: track.id || crypto.randomUUID(),
      title: track.title || 'Titre inconnu',
      artist: track.artist || 'Artiste inconnu',
      url: track.url || track.audioUrl || '',
      audioUrl: track.audioUrl || track.url || '',
      duration: Number(track.duration) || 120,
      emotion: track.emotion,
      mood: track.mood,
      coverUrl: track.coverUrl || track.cover_url,
      tags: track.tags,
      isGenerated: Boolean(track.isGenerated || track.is_generated),
      generatedAt: track.generatedAt || track.generated_at,
      sunoTaskId: track.sunoTaskId || track.suno_task_id,
      bpm: track.bpm ? Number(track.bpm) : undefined,
      key: track.key,
      energy: track.energy ? Number(track.energy) : undefined
    };

    return validateMusicTrack(normalized) ? normalized : null;
  } catch (error) {
    console.error('Erreur normalisation track:', error);
    return null;
  }
};

// Normalise une liste de tracks
export const normalizeMusicTracks = (tracks: any[]): MusicTrack[] => {
  if (!Array.isArray(tracks)) return [];
  
  return tracks
    .map(normalizeMusicTrack)
    .filter((track): track is MusicTrack => track !== null);
};

// Formate la durée en MM:SS
export const formatDuration = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Calcule la durée totale d'une playlist
export const calculatePlaylistDuration = (tracks: MusicTrack[]): number => {
  return ensureArray(tracks).reduce((total, track) => {
    return total + (track.duration || 0);
  }, 0);
};

// Filtre les tracks par émotion
export const filterTracksByEmotion = (tracks: MusicTrack[], emotion: string): MusicTrack[] => {
  return ensureArray(tracks).filter(track => {
    if (track.emotion === emotion) return true;
    if (track.tags && track.tags.includes(emotion)) return true;
    if (track.mood === emotion) return true;
    return false;
  });
};

// Mélange aléatoire d'un tableau (Fisher-Yates)
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Obtient l'URL de cover par défaut
export const getDefaultCoverUrl = (emotion?: string): string => {
  const emotionCovers: Record<string, string> = {
    'calm': '/images/covers/calm.jpg',
    'energetic': '/images/covers/energetic.jpg',
    'happy': '/images/covers/happy.jpg',
    'sad': '/images/covers/sad.jpg',
    'focused': '/images/covers/focused.jpg',
    'creative': '/images/covers/creative.jpg',
    'stressed': '/images/covers/relaxing.jpg'
  };

  return emotionCovers[emotion?.toLowerCase() || ''] || '/images/covers/default.jpg';
};

// Vérifie si un URL audio est valide
export const isValidAudioUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    
    // Vérification des extensions audio communes
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
    const hasAudioExtension = audioExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    // Vérification des domaines de streaming connus
    const streamingDomains = ['spotify.com', 'soundcloud.com', 'youtube.com'];
    const isStreamingUrl = streamingDomains.some(domain => 
      url.includes(domain)
    );
    
    return hasAudioExtension || isStreamingUrl || url.startsWith('blob:');
  } catch {
    return false;
  }
};