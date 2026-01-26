// @ts-nocheck
/**
 * AdaptiveMusicServiceEnriched - Service musique adaptative avec historique, favoris, analytics
 */

import type { MusicTrack, Playlist, AdaptiveMusicConfig } from '@/types/music';
import { logger } from '@/lib/logger';

const HISTORY_KEY = 'adaptive-music-history';
const FAVORITES_KEY = 'adaptive-music-favorites';
const RATINGS_KEY = 'adaptive-music-ratings';
const STATS_KEY = 'adaptive-music-stats';
const PREFERENCES_KEY = 'adaptive-music-preferences';

export interface ListeningHistoryItem {
  id: string;
  track: MusicTrack;
  emotion: string;
  listenedAt: string;
  duration: number; // Temps écouté en secondes
  completed: boolean;
  moodBefore?: number;
  moodAfter?: number;
  source: 'recommendation' | 'search' | 'playlist' | 'random';
}

export interface TrackRating {
  trackId: string;
  rating: number; // 1-5
  ratedAt: string;
  emotion?: string;
}

export interface MusicStats {
  totalListened: number;
  totalMinutes: number;
  favoriteGenres: { genre: string; count: number }[];
  favoriteEmotions: { emotion: string; count: number }[];
  completionRate: number;
  avgMoodImprovement: number;
  topTracks: { trackId: string; title: string; plays: number }[];
  weeklyListening: number[];
  peakHour: number;
}

export interface UserMusicPreferences {
  preferredBpmRange: { min: number; max: number };
  preferredEnergy: number;
  preferredValence: number;
  dislikedGenres: string[];
  favoriteArtists: string[];
  instrumentalPreference: number; // 0-1
  updatedAt: string;
}

export class AdaptiveMusicServiceEnriched {
  private static instance: AdaptiveMusicServiceEnriched;
  private config: AdaptiveMusicConfig;
  private playlists: Map<string, Playlist> = new Map();
  private userPreferences: UserMusicPreferences | null = null;

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
    this.loadUserPreferences();
  }

  static getInstance(): AdaptiveMusicServiceEnriched {
    if (!AdaptiveMusicServiceEnriched.instance) {
      AdaptiveMusicServiceEnriched.instance = new AdaptiveMusicServiceEnriched();
    }
    return AdaptiveMusicServiceEnriched.instance;
  }

  private loadUserPreferences(): void {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      this.userPreferences = JSON.parse(stored);
    } else {
      this.userPreferences = {
        preferredBpmRange: { min: 60, max: 120 },
        preferredEnergy: 0.5,
        preferredValence: 0.6,
        dislikedGenres: [],
        favoriteArtists: [],
        instrumentalPreference: 0.5,
        updatedAt: new Date().toISOString()
      };
    }
  }

  private initializePlaylists(): void {
    // Playlists enrichies avec plus de tracks
    const calmPlaylist: Playlist = {
      id: 'calm',
      name: 'Musique apaisante',
      description: 'Musiques douces pour la relaxation profonde',
      emotion: 'calm',
      tracks: [
        { id: 'calm-1', title: 'Forest Meditation', artist: 'Nature Sounds', duration: 300, url: '/music/calm/forest-meditation.mp3', emotion: 'calm', bpm: 60, energy: 0.2, valence: 0.7 },
        { id: 'calm-2', title: 'Ocean Waves', artist: 'Ambient Nature', duration: 420, url: '/music/calm/ocean-waves.mp3', emotion: 'calm', bpm: 55, energy: 0.1, valence: 0.8 },
        { id: 'calm-3', title: 'Gentle Rain', artist: 'Serenity', duration: 360, url: '/music/calm/gentle-rain.mp3', emotion: 'calm', bpm: 50, energy: 0.15, valence: 0.75 },
        { id: 'calm-4', title: 'Mountain Breeze', artist: 'Zen Masters', duration: 480, url: '/music/calm/mountain-breeze.mp3', emotion: 'calm', bpm: 58, energy: 0.18, valence: 0.72 },
      ]
    };

    const happyPlaylist: Playlist = {
      id: 'happy',
      name: 'Musique joyeuse',
      description: 'Musiques énergisantes et positives',
      emotion: 'happy',
      tracks: [
        { id: 'happy-1', title: 'Sunny Day', artist: 'Upbeat Collective', duration: 240, url: '/music/happy/sunny-day.mp3', emotion: 'happy', bpm: 120, energy: 0.8, valence: 0.9 },
        { id: 'happy-2', title: 'Morning Energy', artist: 'Feel Good Band', duration: 180, url: '/music/happy/morning-energy.mp3', emotion: 'happy', bpm: 110, energy: 0.7, valence: 0.85 },
        { id: 'happy-3', title: 'Celebration', artist: 'Joy Orchestra', duration: 200, url: '/music/happy/celebration.mp3', emotion: 'happy', bpm: 128, energy: 0.85, valence: 0.92 },
        { id: 'happy-4', title: 'Good Vibes', artist: 'Positive Energy', duration: 220, url: '/music/happy/good-vibes.mp3', emotion: 'happy', bpm: 115, energy: 0.75, valence: 0.88 },
      ]
    };

    const focusPlaylist: Playlist = {
      id: 'focus',
      name: 'Musique de concentration',
      description: 'Musiques pour améliorer la focus',
      emotion: 'focused',
      tracks: [
        { id: 'focus-1', title: 'Deep Focus', artist: 'Brain Waves', duration: 600, url: '/music/focus/deep-focus.mp3', emotion: 'focused', bpm: 70, energy: 0.4, valence: 0.5 },
        { id: 'focus-2', title: 'Concentration Flow', artist: 'Mind Music', duration: 540, url: '/music/focus/concentration-flow.mp3', emotion: 'focused', bpm: 75, energy: 0.45, valence: 0.55 },
        { id: 'focus-3', title: 'Study Session', artist: 'Lo-Fi Beats', duration: 480, url: '/music/focus/study-session.mp3', emotion: 'focused', bpm: 80, energy: 0.5, valence: 0.6 },
      ]
    };

    const anxiousPlaylist: Playlist = {
      id: 'anxious',
      name: 'Musique anti-stress',
      description: 'Musiques pour réduire l\'anxiété',
      emotion: 'anxious',
      tracks: [
        { id: 'anxious-1', title: 'Breathing Space', artist: 'Mindful Music', duration: 360, url: '/music/anxious/breathing-space.mp3', emotion: 'calm', bpm: 65, energy: 0.3, valence: 0.6 },
        { id: 'anxious-2', title: 'Safe Harbor', artist: 'Tranquil Sounds', duration: 400, url: '/music/anxious/safe-harbor.mp3', emotion: 'calm', bpm: 60, energy: 0.25, valence: 0.65 },
        { id: 'anxious-3', title: 'Inner Peace', artist: 'Healing Tones', duration: 450, url: '/music/anxious/inner-peace.mp3', emotion: 'calm', bpm: 55, energy: 0.2, valence: 0.7 },
      ]
    };

    this.playlists.set('calm', calmPlaylist);
    this.playlists.set('happy', happyPlaylist);
    this.playlists.set('focus', focusPlaylist);
    this.playlists.set('anxious', anxiousPlaylist);
  }

  // Obtenir une playlist pour une émotion
  getPlaylistForEmotion(emotion: string): Playlist | null {
    const emotionMapping: Record<string, string> = {
      'calm': 'calm', 'peaceful': 'calm', 'relaxed': 'calm', 'serene': 'calm',
      'happy': 'happy', 'joy': 'happy', 'excited': 'happy', 'elated': 'happy',
      'focused': 'focus', 'concentrated': 'focus', 'determined': 'focus',
      'anxious': 'anxious', 'worried': 'anxious', 'stressed': 'anxious', 'nervous': 'anxious',
      'sad': 'calm', 'angry': 'calm'
    };

    const playlistKey = emotionMapping[emotion.toLowerCase()] || 'calm';
    return this.playlists.get(playlistKey) || null;
  }

  // Recommandation personnalisée basée sur les préférences et l'historique
  getPersonalizedRecommendation(emotion: string, context?: { time?: string; activity?: string }): MusicTrack | null {
    const playlist = this.getPlaylistForEmotion(emotion);
    if (!playlist || playlist.tracks.length === 0) return null;

    const history = this.getListeningHistory();
    const ratings = this.getRatings();
    const favorites = this.getFavorites();

    // Score chaque track
    const scoredTracks = playlist.tracks.map(track => {
      let score = this.calculateEmotionScore(track, emotion);

      // Bonus pour les favoris
      if (favorites.includes(track.id)) score += 3;

      // Bonus basé sur les ratings
      const rating = ratings.find(r => r.trackId === track.id);
      if (rating) score += (rating.rating - 3) * 2;

      // Pénalité pour les tracks récemment écoutées
      const recentPlay = history.slice(0, 10).find(h => h.track.id === track.id);
      if (recentPlay) score -= 5;

      // Ajustement selon les préférences utilisateur
      if (this.userPreferences) {
        if (track.bpm && track.bpm >= this.userPreferences.preferredBpmRange.min && track.bpm <= this.userPreferences.preferredBpmRange.max) {
          score += 2;
        }
        if (track.energy && Math.abs(track.energy - this.userPreferences.preferredEnergy) < 0.2) {
          score += 1.5;
        }
      }

      // Ajustement contextuel
      if (context?.time) {
        const hour = parseInt(context.time.split(':')[0]);
        if (hour >= 6 && hour < 10 && track.energy && track.energy > 0.5) score += 1;
        if (hour >= 20 && track.energy && track.energy < 0.4) score += 1;
      }

      return { track, score };
    });

    scoredTracks.sort((a, b) => b.score - a.score);

    // Ajouter un peu de randomisation parmi les top 3
    const topTracks = scoredTracks.slice(0, 3);
    const selectedIndex = Math.floor(Math.random() * topTracks.length);

    return topTracks[selectedIndex]?.track || null;
  }

  // Score basé sur l'émotion
  private calculateEmotionScore(track: MusicTrack, targetEmotion: string): number {
    let score = 0;

    if (track.emotion === targetEmotion) score += 10;

    switch (targetEmotion.toLowerCase()) {
      case 'calm':
      case 'peaceful':
        score += (1 - (track.energy || 0.5)) * 5;
        score += (track.valence || 0.5) * 3;
        break;
      case 'happy':
      case 'joy':
        score += (track.energy || 0.5) * 5;
        score += (track.valence || 0.5) * 5;
        break;
      case 'focused':
        score += Math.abs(0.5 - (track.energy || 0.5)) < 0.2 ? 4 : 0;
        score += (1 - Math.abs(0.5 - (track.valence || 0.5))) * 3;
        break;
      case 'anxious':
      case 'stressed':
        score += (1 - (track.energy || 0.5)) * 7;
        break;
    }

    return score;
  }

  // Historique d'écoute
  logListening(item: Omit<ListeningHistoryItem, 'id'>): void {
    const history = this.getListeningHistory();
    const newItem: ListeningHistoryItem = {
      ...item,
      id: `listen-${Date.now()}`
    };
    history.unshift(newItem);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 500)));
    this.updateStats(newItem);
    logger.debug('Listening logged', { trackId: item.track.id }, 'MUSIC');
  }

  getListeningHistory(limit?: number): ListeningHistoryItem[] {
    const stored = localStorage.getItem(HISTORY_KEY);
    const history: ListeningHistoryItem[] = stored ? JSON.parse(stored) : [];
    return limit ? history.slice(0, limit) : history;
  }

  // Favoris
  toggleFavorite(trackId: string): boolean {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(trackId);

    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(trackId);
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return index === -1;
  }

  getFavorites(): string[] {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  isFavorite(trackId: string): boolean {
    return this.getFavorites().includes(trackId);
  }

  // Ratings
  rateTrack(trackId: string, rating: number, emotion?: string): void {
    const ratings = this.getRatings();
    const existing = ratings.findIndex(r => r.trackId === trackId);

    const newRating: TrackRating = {
      trackId,
      rating: Math.max(1, Math.min(5, rating)),
      ratedAt: new Date().toISOString(),
      emotion
    };

    if (existing > -1) {
      ratings[existing] = newRating;
    } else {
      ratings.push(newRating);
    }

    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    this.updatePreferencesFromRating(trackId, rating);
  }

  getRatings(): TrackRating[] {
    const stored = localStorage.getItem(RATINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  getTrackRating(trackId: string): number | null {
    const rating = this.getRatings().find(r => r.trackId === trackId);
    return rating?.rating || null;
  }

  // Mise à jour des préférences basée sur les ratings
  private updatePreferencesFromRating(trackId: string, rating: number): void {
    if (!this.userPreferences) return;

    // Trouver le track
    let track: MusicTrack | null = null;
    for (const playlist of this.playlists.values()) {
      const found = playlist.tracks.find(t => t.id === trackId);
      if (found) {
        track = found;
        break;
      }
    }

    if (!track) return;

    // Ajuster les préférences si rating >= 4
    if (rating >= 4) {
      if (track.bpm) {
        this.userPreferences.preferredBpmRange.min = Math.min(this.userPreferences.preferredBpmRange.min, track.bpm - 10);
        this.userPreferences.preferredBpmRange.max = Math.max(this.userPreferences.preferredBpmRange.max, track.bpm + 10);
      }
      if (track.energy) {
        this.userPreferences.preferredEnergy = (this.userPreferences.preferredEnergy + track.energy) / 2;
      }
      if (track.valence) {
        this.userPreferences.preferredValence = (this.userPreferences.preferredValence + track.valence) / 2;
      }
    }

    this.userPreferences.updatedAt = new Date().toISOString();
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.userPreferences));
  }

  // Statistiques
  private updateStats(item: ListeningHistoryItem): void {
    const stored = localStorage.getItem(STATS_KEY);
    const stats: MusicStats = stored ? JSON.parse(stored) : {
      totalListened: 0,
      totalMinutes: 0,
      favoriteGenres: [],
      favoriteEmotions: [],
      completionRate: 100,
      avgMoodImprovement: 0,
      topTracks: [],
      weeklyListening: [0, 0, 0, 0, 0, 0, 0],
      peakHour: 12
    };

    stats.totalListened++;
    stats.totalMinutes += Math.round(item.duration / 60);

    // Mise à jour completion rate
    const totalCompleted = Math.round(stats.completionRate * (stats.totalListened - 1) / 100);
    stats.completionRate = Math.round(((totalCompleted + (item.completed ? 1 : 0)) / stats.totalListened) * 100);

    // Mise à jour mood improvement
    if (item.moodBefore !== undefined && item.moodAfter !== undefined) {
      const improvement = item.moodAfter - item.moodBefore;
      stats.avgMoodImprovement = (stats.avgMoodImprovement * (stats.totalListened - 1) + improvement) / stats.totalListened;
    }

    // Mise à jour emotions favorites
    const emotionEntry = stats.favoriteEmotions.find(e => e.emotion === item.emotion);
    if (emotionEntry) {
      emotionEntry.count++;
    } else {
      stats.favoriteEmotions.push({ emotion: item.emotion, count: 1 });
    }
    stats.favoriteEmotions.sort((a, b) => b.count - a.count);

    // Mise à jour top tracks
    const trackEntry = stats.topTracks.find(t => t.trackId === item.track.id);
    if (trackEntry) {
      trackEntry.plays++;
    } else {
      stats.topTracks.push({ trackId: item.track.id, title: item.track.title, plays: 1 });
    }
    stats.topTracks.sort((a, b) => b.plays - a.plays);
    stats.topTracks = stats.topTracks.slice(0, 10);

    // Weekly listening
    const dayOfWeek = new Date().getDay();
    stats.weeklyListening[dayOfWeek]++;

    // Peak hour
    const hour = new Date().getHours();
    stats.peakHour = hour;

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }

  getStats(): MusicStats {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) return JSON.parse(stored);
    return {
      totalListened: 0,
      totalMinutes: 0,
      favoriteGenres: [],
      favoriteEmotions: [],
      completionRate: 100,
      avgMoodImprovement: 0,
      topTracks: [],
      weeklyListening: [0, 0, 0, 0, 0, 0, 0],
      peakHour: 12
    };
  }

  // Export des données
  exportData(format: 'json' | 'csv' = 'json'): string {
    const data = {
      history: this.getListeningHistory(),
      favorites: this.getFavorites(),
      ratings: this.getRatings(),
      stats: this.getStats(),
      preferences: this.userPreferences,
      exportedAt: new Date().toISOString()
    };

    if (format === 'csv') {
      const headers = 'Track ID,Title,Emotion,Listened At,Duration,Completed\n';
      const rows = data.history.map(h =>
        `${h.track.id},${h.track.title},${h.emotion},${h.listenedAt},${h.duration},${h.completed}`
      ).join('\n');
      return headers + rows;
    }

    return JSON.stringify(data, null, 2);
  }

  // Configuration
  updateConfig(newConfig: Partial<AdaptiveMusicConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): AdaptiveMusicConfig {
    return { ...this.config };
  }

  getAllPlaylists(): Playlist[] {
    return Array.from(this.playlists.values());
  }

  addCustomPlaylist(playlist: Playlist): void {
    this.playlists.set(playlist.id, playlist);
  }

  getUserPreferences(): UserMusicPreferences | null {
    return this.userPreferences;
  }
}

export const adaptiveMusicServiceEnriched = AdaptiveMusicServiceEnriched.getInstance();
