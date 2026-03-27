// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

const isRecord = (value: unknown): value is Record<string, any> =>
  typeof value === "object" && value !== null;

export type MoodPlaylistEnergyFocus =
  | "breathing"
  | "flow"
  | "release"
  | "recovery"
  | "uplift"
  | "reset";

export interface MoodPlaylistTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  mood: string;
  energy: number;
  focus: MoodPlaylistEnergyFocus;
  instrumentation: string[];
  tags: string[];
  description: string;
}

export interface MoodPlaylistEnergySegment {
  trackId: string;
  start: number;
  end: number;
  energy: number;
  focus: MoodPlaylistEnergyFocus;
}

export interface MoodPlaylistEnergyProfile {
  baseline: number;
  requested: number | null;
  recommended: number;
  alignment: number;
  curve: MoodPlaylistEnergySegment[];
}

export interface MoodPlaylistGuidance {
  focus: string;
  breathwork: string;
  activities: string[];
}

export interface MoodPlaylistMetadata {
  curatedBy: string;
  tags: string[];
  datasetVersion: string;
}

export interface MoodPlaylistResult {
  playlistId: string;
  mood: string;
  requestedMood: string;
  title: string;
  description: string;
  totalDuration: number;
  unit: "seconds";
  tracks: MoodPlaylistTrack[];
  energyProfile: MoodPlaylistEnergyProfile;
  recommendations: string[];
  guidance: MoodPlaylistGuidance;
  metadata: MoodPlaylistMetadata;
}

export type MoodPlaylistEnergyPreference = "low" | "medium" | "high";

export interface MoodPlaylistPreferences {
  energy?: MoodPlaylistEnergyPreference;
  includeInstrumental?: boolean;
  includeVocals?: boolean;
  instrumentation?: string[];
}

export type MoodPlaylistActivity =
  | "relaxation"
  | "focus"
  | "commute"
  | "sleep"
  | "recovery"
  | "creative"
  | "mood-boost";

export type MoodPlaylistTimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface MoodPlaylistContext {
  activity?: MoodPlaylistActivity;
  timeOfDay?: MoodPlaylistTimeOfDay;
}

export interface MoodPlaylistRequest {
  mood: string;
  intensity?: number;
  durationMinutes?: number;
  preferences?: MoodPlaylistPreferences;
  context?: MoodPlaylistContext;
}

// Playlists prédéfinies par humeur
const MOOD_PLAYLISTS: Record<string, MoodPlaylistTrack[]> = {
  calm: [
    { id: 'calm-1', title: 'Ocean Waves', artist: 'Nature Sounds', url: '/audio/calm-1.mp3', duration: 180, mood: 'calm', energy: 20, focus: 'breathing', instrumentation: ['ambient'], tags: ['nature', 'relaxing'], description: 'Vagues apaisantes' },
    { id: 'calm-2', title: 'Forest Rain', artist: 'Ambient Dreams', url: '/audio/calm-2.mp3', duration: 240, mood: 'calm', energy: 15, focus: 'recovery', instrumentation: ['nature'], tags: ['rain', 'forest'], description: 'Pluie en forêt' },
    { id: 'calm-3', title: 'Soft Piano', artist: 'Classical Moods', url: '/audio/calm-3.mp3', duration: 200, mood: 'calm', energy: 25, focus: 'flow', instrumentation: ['piano'], tags: ['classical', 'soft'], description: 'Piano doux' },
  ],
  energetic: [
    { id: 'energy-1', title: 'Morning Boost', artist: 'Upbeat Collective', url: '/audio/energy-1.mp3', duration: 180, mood: 'energetic', energy: 80, focus: 'uplift', instrumentation: ['electronic', 'drums'], tags: ['upbeat', 'morning'], description: 'Boost matinal' },
    { id: 'energy-2', title: 'Power Flow', artist: 'Workout Beats', url: '/audio/energy-2.mp3', duration: 200, mood: 'energetic', energy: 85, focus: 'flow', instrumentation: ['synth', 'bass'], tags: ['workout', 'power'], description: 'Énergie pure' },
    { id: 'energy-3', title: 'Rise Up', artist: 'Motivation Mix', url: '/audio/energy-3.mp3', duration: 220, mood: 'energetic', energy: 75, focus: 'uplift', instrumentation: ['orchestra', 'drums'], tags: ['epic', 'motivation'], description: 'Motivation épique' },
  ],
  focus: [
    { id: 'focus-1', title: 'Deep Work', artist: 'Concentration Zone', url: '/audio/focus-1.mp3', duration: 300, mood: 'focus', energy: 40, focus: 'flow', instrumentation: ['ambient', 'synth'], tags: ['concentration', 'work'], description: 'Travail profond' },
    { id: 'focus-2', title: 'Alpha Waves', artist: 'Brain Boost', url: '/audio/focus-2.mp3', duration: 360, mood: 'focus', energy: 35, focus: 'flow', instrumentation: ['binaural'], tags: ['alpha', 'brain'], description: 'Ondes alpha' },
    { id: 'focus-3', title: 'Minimal Focus', artist: 'Clean Sounds', url: '/audio/focus-3.mp3', duration: 280, mood: 'focus', energy: 45, focus: 'flow', instrumentation: ['minimal', 'electronic'], tags: ['minimal', 'clean'], description: 'Focus minimal' },
  ],
  melancholic: [
    { id: 'melan-1', title: 'Rainy Day', artist: 'Emotional Piano', url: '/audio/melan-1.mp3', duration: 240, mood: 'melancholic', energy: 30, focus: 'release', instrumentation: ['piano'], tags: ['sad', 'reflective'], description: 'Jour de pluie' },
    { id: 'melan-2', title: 'Nostalgia', artist: 'String Quartet', url: '/audio/melan-2.mp3', duration: 280, mood: 'melancholic', energy: 35, focus: 'release', instrumentation: ['strings'], tags: ['nostalgia', 'emotional'], description: 'Nostalgie' },
    { id: 'melan-3', title: 'Letting Go', artist: 'Ambient Feelings', url: '/audio/melan-3.mp3', duration: 320, mood: 'melancholic', energy: 25, focus: 'release', instrumentation: ['ambient', 'vocals'], tags: ['healing', 'release'], description: 'Lâcher prise' },
  ],
  happy: [
    { id: 'happy-1', title: 'Sunshine', artist: 'Feel Good Sounds', url: '/audio/happy-1.mp3', duration: 180, mood: 'happy', energy: 70, focus: 'uplift', instrumentation: ['acoustic', 'ukulele'], tags: ['happy', 'sunny'], description: 'Rayon de soleil' },
    { id: 'happy-2', title: 'Good Vibes', artist: 'Positive Mix', url: '/audio/happy-2.mp3', duration: 200, mood: 'happy', energy: 65, focus: 'uplift', instrumentation: ['guitar', 'drums'], tags: ['positive', 'vibes'], description: 'Bonnes ondes' },
    { id: 'happy-3', title: 'Celebration', artist: 'Party Beats', url: '/audio/happy-3.mp3', duration: 220, mood: 'happy', energy: 80, focus: 'uplift', instrumentation: ['electronic', 'brass'], tags: ['celebration', 'party'], description: 'Célébration' },
  ],
};

const MOOD_MAPPING: Record<string, string> = {
  anxious: 'calm',
  stressed: 'calm',
  sad: 'melancholic',
  tired: 'energetic',
  bored: 'energetic',
  angry: 'calm',
  joyful: 'happy',
  peaceful: 'calm',
  motivated: 'energetic',
  creative: 'focus',
  distracted: 'focus',
};

/**
 * Génère une playlist adaptée à l'humeur via données locales + Supabase
 */
export async function requestMoodPlaylist(
  request: MoodPlaylistRequest
): Promise<MoodPlaylistResult> {
  const startTime = Date.now();
  
  try {
    // Mapper l'humeur demandée vers une catégorie
    const normalizedMood = request.mood.toLowerCase();
    const mappedMood = MOOD_MAPPING[normalizedMood] || normalizedMood;
    const baseTracks = MOOD_PLAYLISTS[mappedMood] || MOOD_PLAYLISTS.calm;
    
    // Filtrer par préférences d'énergie
    let filteredTracks = [...baseTracks];
    if (request.preferences?.energy) {
      const energyThresholds = { low: 40, medium: 60, high: 100 };
      const maxEnergy = energyThresholds[request.preferences.energy];
      filteredTracks = filteredTracks.filter(t => t.energy <= maxEnergy);
    }
    
    // Limiter par durée si spécifiée
    if (request.durationMinutes) {
      const maxDuration = request.durationMinutes * 60;
      let totalDuration = 0;
      filteredTracks = filteredTracks.filter(track => {
        if (totalDuration + track.duration <= maxDuration) {
          totalDuration += track.duration;
          return true;
        }
        return false;
      });
    }
    
    // Calculer le profil d'énergie
    const totalDuration = filteredTracks.reduce((sum, t) => sum + t.duration, 0);
    const avgEnergy = filteredTracks.length > 0 
      ? filteredTracks.reduce((sum, t) => sum + t.energy, 0) / filteredTracks.length 
      : 50;
    
    const energyCurve: MoodPlaylistEnergySegment[] = [];
    let currentTime = 0;
    for (const track of filteredTracks) {
      energyCurve.push({
        trackId: track.id,
        start: currentTime,
        end: currentTime + track.duration,
        energy: track.energy,
        focus: track.focus,
      });
      currentTime += track.duration;
    }
    
    // Générer les recommandations
    const recommendations: string[] = [];
    if (avgEnergy < 30) {
      recommendations.push('Respirez profondément pendant l\'écoute');
      recommendations.push('Installez-vous confortablement');
    } else if (avgEnergy > 70) {
      recommendations.push('Idéal pour une séance de sport');
      recommendations.push('Bougez au rythme de la musique');
    } else {
      recommendations.push('Parfait pour travailler ou créer');
      recommendations.push('Laissez-vous porter par le flow');
    }
    
    const result: MoodPlaylistResult = {
      playlistId: `playlist-${Date.now()}`,
      mood: mappedMood,
      requestedMood: request.mood,
      title: `Playlist ${mappedMood.charAt(0).toUpperCase() + mappedMood.slice(1)}`,
      description: `Une sélection musicale adaptée à votre humeur ${request.mood}`,
      totalDuration,
      unit: 'seconds',
      tracks: filteredTracks,
      energyProfile: {
        baseline: 50,
        requested: request.intensity ?? null,
        recommended: avgEnergy,
        alignment: Math.abs(avgEnergy - (request.intensity ?? 50)) < 20 ? 0.9 : 0.7,
        curve: energyCurve,
      },
      recommendations,
      guidance: {
        focus: avgEnergy < 40 ? 'Relaxation profonde' : avgEnergy > 70 ? 'Énergie et mouvement' : 'Concentration et flow',
        breathwork: avgEnergy < 40 ? 'Respiration 4-7-8 recommandée' : 'Respiration naturelle',
        activities: avgEnergy < 40 
          ? ['Méditation', 'Lecture', 'Repos']
          : avgEnergy > 70 
            ? ['Sport', 'Danse', 'Ménage']
            : ['Travail', 'Création', 'Étude'],
      },
      metadata: {
        curatedBy: 'EmotionsCare AI',
        tags: [mappedMood, request.context?.activity || 'general', request.context?.timeOfDay || 'anytime'],
        datasetVersion: '2.0.0',
      },
    };
    
    // Log la session dans Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('music_sessions').insert({
          user_id: user.id,
          session_type: 'mood_playlist',
          duration_seconds: totalDuration,
          mood_before: request.mood,
          metadata: {
            requested_mood: request.mood,
            mapped_mood: mappedMood,
            tracks_count: filteredTracks.length,
            avg_energy: avgEnergy,
            preferences: request.preferences,
            context: request.context,
          },
        });
      }
    } catch (dbError) {
      logger.warn('Failed to log mood playlist session', { error: dbError }, 'MUSIC');
    }
    
    logger.info('Mood playlist generated', {
      mood: mappedMood,
      tracksCount: filteredTracks.length,
      duration: totalDuration,
      latencyMs: Date.now() - startTime,
    }, 'MUSIC');
    
    return result;
  } catch (error) {
    logger.error('Failed to generate mood playlist', error as Error, 'MUSIC');
    throw new Error('Impossible de générer la playlist adaptive');
  }
}

/**
 * Récupère l'historique des playlists de l'utilisateur
 */
export async function getMoodPlaylistHistory(limit = 10): Promise<MoodPlaylistResult[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('music_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('session_type', 'mood_playlist')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Reconstruire les playlists à partir des métadonnées
    return (data || []).map(session => ({
      playlistId: session.id,
      mood: session.metadata?.mapped_mood || 'calm',
      requestedMood: session.mood_before || '',
      title: `Playlist ${session.metadata?.mapped_mood || 'Calm'}`,
      description: '',
      totalDuration: session.duration_seconds || 0,
      unit: 'seconds' as const,
      tracks: [],
      energyProfile: {
        baseline: 50,
        requested: null,
        recommended: session.metadata?.avg_energy || 50,
        alignment: 0.8,
        curve: [],
      },
      recommendations: [],
      guidance: { focus: '', breathwork: '', activities: [] },
      metadata: { curatedBy: 'EmotionsCare AI', tags: [], datasetVersion: '2.0.0' },
    }));
  } catch (error) {
    logger.error('Failed to get mood playlist history', error as Error, 'MUSIC');
    return [];
  }
}
