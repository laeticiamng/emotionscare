/**
 * Service de recommandations musicales basées sur l'état émotionnel
 */

import { moodToBucket, type Mood, type MusicBucket } from './moodMap';

export interface Track {
  id: string;
  title: string;
  artist?: string;
  cover?: string;
  url: string;
  duration_sec: number;
  genre?: string;
  bpm?: number;
}

interface RecommendationOptions {
  preview?: boolean;
  limit?: number;
}

export async function getRecommendations(
  mood: Mood,
  options: RecommendationOptions = {}
): Promise<Track[]> {
  const { preview = false, limit = 5 } = options;
  const bucket = moodToBucket(mood);
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (preview) {
    return [{
      id: `preview:${bucket}:001`,
      title: 'Aperçu musical',
      artist: 'EmotionsCare',
      url: '/audio/samples/preview-30s.mp3',
      duration_sec: 30,
      genre: 'Thérapeutique'
    }];
  }
  
  const tracks = getTracksForBucket(bucket);
  return tracks.slice(0, limit);
}

function getTracksForBucket(bucket: MusicBucket): Track[] {
  const baseTracks: Record<MusicBucket, Track[]> = {
    'calm/very_low': [
      {
        id: 'calm-very-low:001',
        title: 'Cocon de sérénité',
        artist: 'Harmonie Profonde',
        url: '/audio/calm/very-low-serenity.mp3',
        duration_sec: 480,
        genre: 'Méditation'
      }
    ],
    'calm/low': [
      {
        id: 'calm-low:001',
        title: 'Vague douce',
        artist: 'Océan Thérapie',
        url: '/audio/calm/gentle-wave.mp3',
        duration_sec: 420,
        genre: 'Relaxation'
      }
    ],
    'focus/medium': [
      {
        id: 'focus-medium:001',
        title: 'Flow mental',
        artist: 'Concentration Pure',
        url: '/audio/focus/mental-flow.mp3',
        duration_sec: 900,
        genre: 'Focus'
      }
    ],
    'bright/low': [
      {
        id: 'bright-low:001',
        title: 'Aurore bienveillante',
        artist: 'Lumière Douce',
        url: '/audio/bright/gentle-dawn.mp3',
        duration_sec: 300,
        genre: 'Bien-être'
      }
    ],
    'bright/medium': [
      {
        id: 'bright-medium:001',
        title: 'Harmonie équilibrée',
        artist: 'Balance Parfaite',
        url: '/audio/bright/balanced-harmony.mp3',
        duration_sec: 450,
        genre: 'Équilibre'
      }
    ],
    'reset': [
      {
        id: 'reset:001',
        title: 'Page blanche',
        artist: 'Nouveau Départ',
        url: '/audio/reset/blank-page.mp3',
        duration_sec: 300,
        genre: 'Neutre'
      }
    ]
  };
  
  return baseTracks[bucket] || baseTracks.reset;
}

export async function getTrackById(trackId: string): Promise<Track | null> {
  const allBuckets: MusicBucket[] = [
    'calm/very_low', 'calm/low', 'focus/medium', 
    'bright/low', 'bright/medium', 'reset'
  ];
  
  for (const bucket of allBuckets) {
    const tracks = getTracksForBucket(bucket);
    const track = tracks.find(t => t.id === trackId);
    if (track) return track;
  }
  
  return null;
}