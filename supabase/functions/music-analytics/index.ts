import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, trackId, userId, emotion, metadata } = await req.json();
    
    console.log('🎵 Music analytics:', { action, trackId, userId, emotion });

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

    let result;

    switch (action) {
      case 'play_track':
        result = await handlePlayTrack(supabase, user.id, trackId, emotion, metadata);
        break;
      
      case 'track_completed':
        result = await handleTrackCompleted(supabase, user.id, trackId, metadata);
        break;
      
      case 'skip_track':
        result = await handleSkipTrack(supabase, user.id, trackId, metadata);
        break;
      
      case 'like_track':
        result = await handleLikeTrack(supabase, user.id, trackId, metadata);
        break;
      
      case 'get_recommendations':
        result = await getRecommendations(supabase, user.id, emotion);
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in music-analytics:', error);
    return new Response(JSON.stringify({ 
      error: 'Analytics processing failed',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handlePlayTrack(supabase: any, userId: string, trackId: string, emotion: string, metadata: any) {
  // Record play event
  const { error: playError } = await supabase
    .from('music_play_logs')
    .insert({
      user_id: userId,
      track_id: trackId,
      emotion_context: emotion,
      play_timestamp: new Date().toISOString(),
      session_metadata: metadata || {}
    });

  if (playError) {
    console.error('Error logging play event:', playError);
  }

  // Update user music preferences
  const { error: prefError } = await supabase
    .from('user_music_preferences')
    .upsert({
      user_id: userId,
      preferred_emotions: supabase.sql`
        CASE 
          WHEN preferred_emotions IS NULL THEN ARRAY[${emotion}]
          WHEN NOT (${emotion} = ANY(preferred_emotions)) THEN array_append(preferred_emotions, ${emotion})
          ELSE preferred_emotions
        END
      `,
      last_played_emotion: emotion,
      total_plays: supabase.sql`COALESCE(total_plays, 0) + 1`,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });

  if (prefError) {
    console.error('Error updating preferences:', prefError);
  }

  return { success: true, action: 'play_tracked' };
}

async function handleTrackCompleted(supabase: any, userId: string, trackId: string, metadata: any) {
  const { error } = await supabase
    .from('music_completion_logs')
    .insert({
      user_id: userId,
      track_id: trackId,
      completion_timestamp: new Date().toISOString(),
      listen_duration: metadata?.duration || 0,
      completion_percentage: metadata?.completionPercentage || 100
    });

  if (error) {
    console.error('Error logging completion:', error);
  }

  return { success: true, action: 'completion_tracked' };
}

async function handleSkipTrack(supabase: any, userId: string, trackId: string, metadata: any) {
  const { error } = await supabase
    .from('music_skip_logs')
    .insert({
      user_id: userId,
      track_id: trackId,
      skip_timestamp: new Date().toISOString(),
      skip_position: metadata?.position || 0,
      skip_reason: metadata?.reason || 'user_skip'
    });

  if (error) {
    console.error('Error logging skip:', error);
  }

  return { success: true, action: 'skip_tracked' };
}

async function handleLikeTrack(supabase: any, userId: string, trackId: string, metadata: any) {
  const isLiked = metadata?.isLiked || false;

  if (isLiked) {
    const { error } = await supabase
      .from('user_favorite_tracks')
      .insert({
        user_id: userId,
        track_id: trackId,
        favorited_at: new Date().toISOString()
      });

    if (error && error.code !== '23505') { // Ignore unique constraint violations
      console.error('Error adding favorite:', error);
    }
  } else {
    const { error } = await supabase
      .from('user_favorite_tracks')
      .delete()
      .match({ user_id: userId, track_id: trackId });

    if (error) {
      console.error('Error removing favorite:', error);
    }
  }

  return { success: true, action: 'like_tracked', isLiked };
}

async function getRecommendations(supabase: any, userId: string, emotion: string) {
  // Get user's listening history and preferences
  const { data: preferences } = await supabase
    .from('user_music_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  const { data: recentPlays } = await supabase
    .from('music_play_logs')
    .select('track_id, emotion_context')
    .eq('user_id', userId)
    .order('play_timestamp', { ascending: false })
    .limit(20);

  // Get similar users' preferences
  const { data: similarUsers } = await supabase
    .from('user_music_preferences')
    .select('user_id, preferred_emotions')
    .neq('user_id', userId)
    .contains('preferred_emotions', [emotion])
    .limit(10);

  // Generate recommendations based on emotion and user history
  const recommendations = generateRecommendations({
    emotion,
    preferences,
    recentPlays: recentPlays || [],
    similarUsers: similarUsers || []
  });

  return {
    success: true,
    recommendations,
    emotion,
    total_recommendations: recommendations.length
  };
}

function generateRecommendations({ emotion, preferences, recentPlays, similarUsers }: any) {
  // This would be more sophisticated in production
  // For now, return emotion-based recommendations
  
  const emotionRecommendations = {
    happy: [
      { id: 'rec-happy-1', title: 'Uplifting Beats', artist: 'Joy Generator', emotion: 'happy', confidence: 0.9 },
      { id: 'rec-happy-2', title: 'Sunshine Dance', artist: 'Bright Sounds', emotion: 'happy', confidence: 0.85 },
      { id: 'rec-happy-3', title: 'Feel Good Vibes', artist: 'Positive Energy', emotion: 'happy', confidence: 0.8 }
    ],
    calm: [
      { id: 'rec-calm-1', title: 'Peaceful Waters', artist: 'Serenity Now', emotion: 'calm', confidence: 0.95 },
      { id: 'rec-calm-2', title: 'Gentle Breeze', artist: 'Tranquil Sounds', emotion: 'calm', confidence: 0.9 },
      { id: 'rec-calm-3', title: 'Quiet Mind', artist: 'Meditation Music', emotion: 'calm', confidence: 0.88 }
    ],
    energetic: [
      { id: 'rec-energy-1', title: 'Power Surge', artist: 'Electric Force', emotion: 'energetic', confidence: 0.92 },
      { id: 'rec-energy-2', title: 'High Voltage', artist: 'Dynamic Beats', emotion: 'energetic', confidence: 0.87 },
      { id: 'rec-energy-3', title: 'Adrenaline Rush', artist: 'Peak Performance', emotion: 'energetic', confidence: 0.83 }
    ]
  };

  return emotionRecommendations[emotion as keyof typeof emotionRecommendations] || 
         emotionRecommendations.calm;
}