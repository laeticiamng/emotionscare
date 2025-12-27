import type { MusicTrack, Playlist, AdaptiveMusicConfig } from '@/types/music';

export class AdaptiveMusicService {
  private static instance: AdaptiveMusicService;
  private config: AdaptiveMusicConfig;
  private playlists: Map<string, Playlist> = new Map();

  private constructor() {
    this.config = {
      enabled: true,
      emotionSensitivity: 0.7,
      autoTransition: true,
      fadeInDuration: 2000,
      fadeOutDuration: 1500,
      volumeAdjustment: true
    };
    this.initializePlaylists();
  }

  static getInstance(): AdaptiveMusicService {
    if (!AdaptiveMusicService.instance) {
      AdaptiveMusicService.instance = new AdaptiveMusicService();
    }
    return AdaptiveMusicService.instance;
  }

  private initializePlaylists() {
    // Playlist pour l'état calme
    const calmPlaylist: Playlist = {
      id: 'calm',
      name: 'Musique apaisante',
      description: 'Musiques douces pour la relaxation',
      emotion: 'calm',
      tracks: [
        {
          id: 'calm-1',
          title: 'Forest Meditation',
          artist: 'Nature Sounds',
          duration: 300,
          url: '/music/calm/forest-meditation.mp3',
          audioUrl: '/music/calm/forest-meditation.mp3',
          emotion: 'calm',
          bpm: 60,
          energy: 0.2,
          valence: 0.7
        },
        {
          id: 'calm-2',
          title: 'Ocean Waves',
          artist: 'Ambient Nature',
          duration: 420,
          url: '/music/calm/ocean-waves.mp3',
          audioUrl: '/music/calm/ocean-waves.mp3',
          emotion: 'calm',
          bpm: 55,
          energy: 0.1,
          valence: 0.8
        }
      ]
    };

    // Playlist pour l'état joyeux
    const happyPlaylist: Playlist = {
      id: 'happy',
      name: 'Musique joyeuse',
      description: 'Musiques énergisantes et positives',
      emotion: 'happy',
      tracks: [
        {
          id: 'happy-1',
          title: 'Sunny Day',
          artist: 'Upbeat Collective',
          duration: 240,
          url: '/music/happy/sunny-day.mp3',
          audioUrl: '/music/happy/sunny-day.mp3',
          emotion: 'happy',
          bpm: 120,
          energy: 0.8,
          valence: 0.9
        },
        {
          id: 'happy-2',
          title: 'Morning Energy',
          artist: 'Feel Good Band',
          duration: 180,
          url: '/music/happy/morning-energy.mp3',
          audioUrl: '/music/happy/morning-energy.mp3',
          emotion: 'happy',
          bpm: 110,
          energy: 0.7,
          valence: 0.85
        }
      ]
    };

    // Playlist pour l'anxiété
    const anxiousPlaylist: Playlist = {
      id: 'anxious',
      name: 'Musique apaisante anti-stress',
      description: 'Musiques pour réduire l\'anxiété',
      emotion: 'anxious',
      tracks: [
        {
          id: 'anxious-1',
          title: 'Breathing Space',
          artist: 'Mindful Music',
          duration: 360,
          url: '/music/anxious/breathing-space.mp3',
          audioUrl: '/music/anxious/breathing-space.mp3',
          emotion: 'calm',
          bpm: 65,
          energy: 0.3,
          valence: 0.6
        }
      ]
    };

    this.playlists.set('calm', calmPlaylist);
    this.playlists.set('happy', happyPlaylist);
    this.playlists.set('anxious', anxiousPlaylist);
  }

  getPlaylistForEmotion(emotion: string): Playlist | null {
    // Mappage des émotions vers les playlists appropriées
    const emotionMapping: Record<string, string> = {
      'calm': 'calm',
      'peaceful': 'calm',
      'relaxed': 'calm',
      'happy': 'happy',
      'joy': 'happy',
      'excited': 'happy',
      'anxious': 'anxious',
      'worried': 'anxious',
      'stressed': 'anxious',
      'sad': 'calm', // Musique apaisante pour la tristesse
      'angry': 'calm', // Musique calmante pour la colère
    };

    const playlistKey = emotionMapping[emotion.toLowerCase()] || 'calm';
    return this.playlists.get(playlistKey) || null;
  }

  getRecommendedTrack(emotion: string, currentMood?: string): MusicTrack | null {
    const playlist = this.getPlaylistForEmotion(emotion);
    if (!playlist || playlist.tracks.length === 0) return null;

    // Sélectionner le meilleur track basé sur l'émotion
    const sortedTracks = playlist.tracks.sort((a, b) => {
      // Score basé sur l'émotion cible
      const scoreA = this.calculateEmotionScore(a, emotion);
      const scoreB = this.calculateEmotionScore(b, emotion);
      return scoreB - scoreA;
    });

    return sortedTracks[0];
  }

  private calculateEmotionScore(track: MusicTrack, targetEmotion: string): number {
    // Algorithme simple pour scorer un track par rapport à une émotion cible
    let score = 0;

    if (track.emotion === targetEmotion) {
      score += 10;
    }

    // Ajustements basés sur les caractéristiques audio
    switch (targetEmotion.toLowerCase()) {
      case 'calm':
      case 'peaceful':
        score += (1 - (track.energy || 0.5)) * 5; // Favorise les tracks moins énergiques
        score += (track.valence || 0.5) * 3; // Favorise les tracks positives mais douces
        break;
      case 'happy':
      case 'joy':
        score += (track.energy || 0.5) * 5; // Favorise les tracks énergiques
        score += (track.valence || 0.5) * 5; // Favorise les tracks très positives
        break;
      case 'anxious':
      case 'stressed':
        score += (1 - (track.energy || 0.5)) * 7; // Favorise les tracks très calmes
        score += Math.max(0, 0.7 - (track.valence || 0.5)) * 3; // Favorise les tracks neutres à positives
        break;
    }

    return score;
  }

  updateConfig(newConfig: Partial<AdaptiveMusicConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): AdaptiveMusicConfig {
    return { ...this.config };
  }

  getAllPlaylists(): Playlist[] {
    return Array.from(this.playlists.values());
  }

  addCustomPlaylist(playlist: Playlist) {
    this.playlists.set(playlist.id, playlist);
  }
}

export const adaptiveMusicService = AdaptiveMusicService.getInstance();
