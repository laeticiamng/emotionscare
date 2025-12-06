import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  emotion: string;
  intensity: number;
  imageUrl?: string;
  isGenerated: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emotion, intensity, userId } = await req.json();
    
    console.log('🎵 Generating music for:', { emotion, intensity, userId });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    // Generate music tracks based on emotion
    const tracks: MusicTrack[] = await generateTracksForEmotion(emotion, intensity);

    // Store generation record
    const { error: insertError } = await supabase
      .from('music_generation_logs')
      .insert({
        user_id: user.id,
        emotion: emotion,
        intensity: intensity,
        tracks_generated: tracks.length,
        generation_metadata: {
          emotion_analysis: { emotion, intensity },
          tracks_info: tracks.map(t => ({ id: t.id, title: t.title, duration: t.duration }))
        }
      });

    if (insertError) {
      console.error('Error storing generation log:', insertError);
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      route: '/music-generation',
      page_key: 'emotion_music_generation',
      context: {
        emotion: emotion,
        intensity: intensity,
        tracks_count: tracks.length
      }
    });

    console.log('✅ Generated', tracks.length, 'tracks for emotion:', emotion);

    return new Response(JSON.stringify({ 
      success: true,
      tracks: tracks,
      emotion: emotion,
      intensity: intensity
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in emotion-music-generation:', error);
    return new Response(JSON.stringify({ 
      error: 'Music generation failed',
      message: error.message,
      fallback_tracks: generateFallbackTracks()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateTracksForEmotion(emotion: string, intensity: number): Promise<MusicTrack[]> {
  // In production, this would call real music generation APIs like:
  // - OpenAI's music generation
  // - Stable Audio
  // - MusicLM
  // - Custom trained models
  
  const emotionTemplates = {
    happy: {
      genres: ['Pop', 'Dance', 'Folk', 'Electronic'],
      tempos: [120, 128, 140, 110],
      keys: ['C major', 'G major', 'D major', 'A major'],
      moods: ['uplifting', 'energetic', 'cheerful', 'bright']
    },
    calm: {
      genres: ['Ambient', 'Classical', 'Lo-Fi', 'Nature'],
      tempos: [60, 72, 80, 90],
      keys: ['Am', 'Em', 'Dm', 'F major'],
      moods: ['peaceful', 'serene', 'meditative', 'gentle']
    },
    energetic: {
      genres: ['Electronic', 'Rock', 'Hip-Hop', 'Drum & Bass'],
      tempos: [140, 150, 160, 174],
      keys: ['E minor', 'A minor', 'D minor', 'B minor'],
      moods: ['powerful', 'dynamic', 'intense', 'driving']
    },
    focused: {
      genres: ['Instrumental', 'Classical', 'Lo-Fi', 'Minimalist'],
      tempos: [90, 100, 110, 120],
      keys: ['C major', 'F major', 'Bb major', 'G major'],
      moods: ['concentrated', 'clear', 'structured', 'flowing']
    },
    sad: {
      genres: ['Blues', 'Classical', 'Indie', 'Acoustic'],
      tempos: [60, 70, 80, 90],
      keys: ['Dm', 'Am', 'Em', 'Gm'],
      moods: ['melancholic', 'reflective', 'emotional', 'tender']
    },
    anxious: {
      genres: ['Ambient', 'Classical', 'Nature Sounds', 'Meditation'],
      tempos: [60, 65, 70, 75],
      keys: ['F major', 'C major', 'G major', 'D major'],
      moods: ['soothing', 'reassuring', 'grounding', 'calming']
    }
  };

  const template = emotionTemplates[emotion as keyof typeof emotionTemplates] || emotionTemplates.calm;
  const trackCount = Math.min(6, Math.max(3, Math.round(intensity * 8)));

  const tracks: MusicTrack[] = [];

  for (let i = 0; i < trackCount; i++) {
    const genre = template.genres[i % template.genres.length];
    const tempo = template.tempos[i % template.tempos.length];
    const mood = template.moods[i % template.moods.length];
    
    // Generate unique track
    const track: MusicTrack = {
      id: `track-${emotion}-${Date.now()}-${i}`,
      title: generateTrackTitle(emotion, mood, i + 1),
      artist: generateArtistName(genre),
      duration: Math.floor(Math.random() * 120) + 180, // 3-5 minutes
      url: generateTrackUrl(emotion, tempo, mood),
      emotion: emotion,
      intensity: intensity,
      imageUrl: generateAlbumArt(emotion, mood),
      isGenerated: true
    };

    tracks.push(track);
  }

  return tracks;
}

function generateTrackTitle(emotion: string, mood: string, index: number): string {
  const titleTemplates = {
    happy: ['Sunshine Melody', 'Joyful Journey', 'Bright Horizons', 'Dancing Light', 'Golden Moments'],
    calm: ['Peaceful Waters', 'Quiet Mind', 'Serene Dawn', 'Gentle Breeze', 'Tranquil Space'],
    energetic: ['Power Surge', 'Electric Flow', 'Dynamic Force', 'High Voltage', 'Energy Wave'],
    focused: ['Clear Path', 'Mind Flow', 'Concentrated Energy', 'Focus Point', 'Mental Clarity'],
    sad: ['Tears of Rain', 'Melancholy Sky', 'Gentle Sorrow', 'Healing Pain', 'Quiet Tears'],
    anxious: ['Calming Breath', 'Safe Harbor', 'Peaceful Ground', 'Anxiety Relief', 'Comfort Zone']
  };

  const templates = titleTemplates[emotion as keyof typeof titleTemplates] || titleTemplates.calm;
  return templates[(index - 1) % templates.length] + ` (${mood})`;
}

function generateArtistName(genre: string): string {
  const artistNames = {
    'Pop': ['Luna Sol', 'Echo Dreams', 'Bright Waves', 'Crystal Voice'],
    'Ambient': ['Ethereal Sounds', 'Peaceful Mind', 'Serenity Studio', 'Calm Collective'],
    'Electronic': ['Digital Soul', 'Synth Masters', 'Electric Minds', 'Pulse Generator'],
    'Classical': ['Symphony AI', 'Classical Ensemble', 'Orchestral Mind', 'Harmony Collective'],
    'Lo-Fi': ['Chill Beats', 'Study Sounds', 'Lazy Afternoons', 'Coffee Shop'],
    'Rock': ['Power Trio', 'Electric Storm', 'Heavy Dreams', 'Rock Foundation'],
    'Default': ['AI Composer', 'Generated Music', 'Synthetic Sound', 'Digital Artist']
  };

  const names = artistNames[genre as keyof typeof artistNames] || artistNames.Default;
  return names[Math.floor(Math.random() * names.length)];
}

function generateTrackUrl(emotion: string, tempo: number, mood: string): string {
  // In production, this would return actual audio URLs from generated content
  // For now, we'll use placeholder URLs that could be replaced with real audio
  return `https://example-music-api.com/generate/${emotion}/${tempo}/${mood}.mp3`;
}

function generateAlbumArt(emotion: string, mood: string): string {
  // In production, this would generate actual album art using DALL-E or similar
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${emotion}-${mood}&backgroundColor=random`;
}

function generateFallbackTracks(): MusicTrack[] {
  return [
    {
      id: 'fallback-1',
      title: 'Calming Sounds',
      artist: 'AI Composer',
      duration: 240,
      url: 'https://example.com/fallback-calm.mp3',
      emotion: 'calm',
      intensity: 0.5,
      isGenerated: true
    },
    {
      id: 'fallback-2',
      title: 'Peaceful Mind',
      artist: 'Digital Artist',
      duration: 300,
      url: 'https://example.com/fallback-peaceful.mp3',
      emotion: 'calm',
      intensity: 0.6,
      isGenerated: true
    }
  ];
}