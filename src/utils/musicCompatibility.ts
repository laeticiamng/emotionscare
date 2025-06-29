
// Utilitaires pour assurer la compatibilité avec différents formats de musique

export const ensureArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export const normalizeMusicTrack = (track: any): any => {
  return {
    id: track.id || crypto.randomUUID(),
    title: track.title || 'Titre inconnu',
    artist: track.artist || 'Artiste inconnu',
    url: track.url || track.audio_url || '',
    duration: track.duration || 240,
    emotion: track.emotion || 'neutral',
    coverUrl: track.coverUrl || track.image_url,
    genre: track.genre || 'ambient',
    energy: track.energy || 0.5,
    valence: track.valence || 0.5
  };
};

export const createMusicPlaylist = (tracks: any[], emotion: string, name?: string) => {
  return {
    id: crypto.randomUUID(),
    name: name || `Playlist ${emotion}`,
    tracks: ensureArray(tracks).map(normalizeMusicTrack),
    emotion,
    description: `Musique générée pour l'émotion: ${emotion}`
  };
};
