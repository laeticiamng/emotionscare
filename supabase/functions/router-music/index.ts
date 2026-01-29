// @ts-nocheck
/**
 * ROUTER MUSIC - Super-routeur Musique consolidé
 * Regroupe: suno-music, generate-music, adaptive-music, emotion-music-ai, music-api, etc.
 * 
 * Actions disponibles:
 * - generate: Générer de la musique
 * - status: Vérifier le statut d'une génération
 * - extend: Étendre un morceau
 * - remix: Remixer un morceau
 * - analyze-emotions: Analyser les émotions pour recommandation musicale
 * - recommendations: Obtenir des recommandations
 * - save-preferences: Sauvegarder les préférences
 * - credits: Vérifier les crédits
 * - fallback: Obtenir un morceau de secours
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUNO_API_BASE = 'https://api.sunoapi.org';

// Fallback tracks (Pixabay, CORS-friendly)
const FALLBACK_TRACKS: Record<string, { url: string; duration: number; bpm: number }[]> = {
  calm: [
    { url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3', duration: 180, bpm: 60 },
    { url: 'https://cdn.pixabay.com/audio/2021/04/06/audio_63aa86e805.mp3', duration: 195, bpm: 55 },
  ],
  energize: [
    { url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_946b0939c8.mp3', duration: 150, bpm: 120 },
  ],
  focus: [
    { url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8cb749d484.mp3', duration: 240, bpm: 80 },
  ],
  sleep: [
    { url: 'https://cdn.pixabay.com/audio/2021/04/06/audio_63aa86e805.mp3', duration: 300, bpm: 50 },
  ],
  meditation: [
    { url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3', duration: 120, bpm: 60 },
  ],
  joy: [
    { url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_946b0939c8.mp3', duration: 150, bpm: 100 },
  ],
};

const EMOTION_PROFILES = {
  joy: { prompt: 'Uplifting bright energetic therapeutic music', tempo: 120 },
  calm: { prompt: 'Peaceful ambient soft relaxing music', tempo: 60 },
  sad: { prompt: 'Melancholic comforting emotional music', tempo: 70 },
  anger: { prompt: 'Intense cathartic transformative music', tempo: 100 },
  anxious: { prompt: 'Grounding calming reassuring music', tempo: 65 },
  energetic: { prompt: 'Dynamic motivating powerful music', tempo: 130 },
  neutral: { prompt: 'Balanced peaceful harmonious music', tempo: 90 },
};

interface RouterRequest {
  action: string;
  payload: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse('Authorization required', 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse('Invalid token', 401);
    }

    const body: RouterRequest = await req.json();
    const { action, payload = {} } = body;

    if (!action) {
      return errorResponse('Action is required', 400);
    }

    const sunoKey = Deno.env.get('SUNO_API_KEY');
    console.log(`[router-music] Action: ${action}, User: ${user.id}`);

    switch (action) {
      case 'generate':
        return await handleGenerate(payload, user, supabase, sunoKey);
      
      case 'status':
        return await handleStatus(payload, supabase, sunoKey);
      
      case 'extend':
        return await handleExtend(payload, sunoKey);
      
      case 'analyze-emotions':
        return await handleAnalyzeEmotions(user, supabase);
      
      case 'recommendations':
        return await handleRecommendations(user, supabase);
      
      case 'credits':
        return await handleCredits(sunoKey);
      
      case 'fallback':
        return handleFallback(payload);
      
      case 'save-preferences':
        return await handleSavePreferences(payload, user, supabase);
      
      case 'health':
        return successResponse({ status: 'ok', hasApiKey: !!sunoKey });

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }

  } catch (error) {
    console.error('[router-music] Error:', error);
    // Fallback en cas d'erreur
    const fallback = getFallbackTrack('calm');
    return new Response(JSON.stringify({
      success: true,
      isFallback: true,
      error: error.message,
      data: {
        id: fallback.id,
        audio_url: fallback.url,
        status: 'completed',
        duration: fallback.duration,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// ============ HANDLERS ============

async function handleGenerate(payload: any, user: any, supabase: any, sunoKey: string | undefined): Promise<Response> {
  const { emotion = 'neutral', prompt, style, title, instrumental = true, bpmMin, bpmMax } = payload;

  // Pas de clé API = fallback direct
  if (!sunoKey) {
    console.log('[router-music] No API key, returning fallback');
    const fallback = getFallbackTrack(emotion);
    return successResponse({
      isFallback: true,
      data: {
        id: fallback.id,
        audio_url: fallback.url,
        status: 'completed',
        duration: fallback.duration,
        bpm: fallback.bpm,
      },
    });
  }

  const profile = EMOTION_PROFILES[emotion as keyof typeof EMOTION_PROFILES] || EMOTION_PROFILES.neutral;
  const finalPrompt = prompt || profile.prompt;
  let finalStyle = style || `therapeutic ${emotion} ambient`;

  if (bpmMin && bpmMax) {
    finalStyle += `, tempo ${bpmMin}-${bpmMax} BPM`;
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const callBackUrl = `${supabaseUrl}/functions/v1/suno-callback`;

  try {
    const generateRes = await fetch(`${SUNO_API_BASE}/api/v1/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sunoKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customMode: true,
        instrumental,
        model: 'V4_5',
        prompt: finalPrompt,
        style: finalStyle,
        title: title || `${emotion} - Therapeutic Music`,
        callBackUrl,
      }),
    });

    if (!generateRes.ok) {
      console.error(`[router-music] Suno error: ${generateRes.status}`);
      const fallback = getFallbackTrack(emotion);
      return successResponse({
        isFallback: true,
        data: { id: fallback.id, audio_url: fallback.url, status: 'completed' },
      });
    }

    const sunoData = await generateRes.json();
    const taskId = sunoData?.data?.taskId || sunoData?.taskId || sunoData?.id;

    if (!taskId) {
      console.error('[router-music] No taskId in response');
      const fallback = getFallbackTrack(emotion);
      return successResponse({
        isFallback: true,
        data: { id: fallback.id, audio_url: fallback.url, status: 'completed' },
      });
    }

    // Sauvegarder le track
    const { data: track } = await supabase
      .from('generated_music_tracks')
      .insert({
        user_id: user.id,
        title: title || `${emotion} - Therapeutic Music`,
        emotion,
        prompt: finalPrompt,
        original_task_id: taskId,
        generation_status: 'pending',
        metadata: { profile, emotion, prompt: finalPrompt },
      })
      .select()
      .single();

    return successResponse({
      taskId,
      trackId: track?.id,
      status: 'generating',
      emotion,
      isFallback: false,
    });

  } catch (error) {
    console.error('[router-music] Generate error:', error);
    const fallback = getFallbackTrack(emotion);
    return successResponse({
      isFallback: true,
      data: { id: fallback.id, audio_url: fallback.url, status: 'completed' },
    });
  }
}

async function handleStatus(payload: any, supabase: any, sunoKey: string | undefined): Promise<Response> {
  const { taskId, trackId } = payload;

  if (!taskId) {
    return errorResponse('TaskId is required', 400);
  }

  // Fallback check
  if (taskId.startsWith('fallback-')) {
    return successResponse({ status: 'completed', isFallback: true });
  }

  if (!sunoKey) {
    return successResponse({ status: 'pending' });
  }

  try {
    const statusRes = await fetch(
      `${SUNO_API_BASE}/api/v1/generate/record-info?taskId=${encodeURIComponent(taskId)}`,
      { headers: { 'Authorization': `Bearer ${sunoKey}` } }
    );

    if (!statusRes.ok) {
      return successResponse({ status: 'pending' });
    }

    const rawData = await statusRes.json();
    const sunoTracks = rawData.data?.response?.sunoData || [];
    const firstTrack = sunoTracks[0];
    const isComplete = ['SUCCESS', 'TEXT_SUCCESS', 'FIRST_SUCCESS'].includes(rawData.data?.status);

    const result = {
      status: isComplete ? 'completed' : 'pending',
      audio_url: firstTrack?.audioUrl || firstTrack?.streamAudioUrl,
      image_url: firstTrack?.imageUrl,
      duration: firstTrack?.duration,
    };

    // Update track if complete
    if (isComplete && result.audio_url && trackId) {
      await supabase
        .from('generated_music_tracks')
        .update({
          audio_url: result.audio_url,
          image_url: result.image_url,
          duration: result.duration,
          generation_status: 'complete',
        })
        .eq('id', trackId);
    }

    return successResponse(result);

  } catch (error) {
    console.error('[router-music] Status error:', error);
    return successResponse({ status: 'pending' });
  }
}

async function handleExtend(payload: any, sunoKey: string | undefined): Promise<Response> {
  const { audioId, continueAt = 120, prompt, style, title } = payload;

  if (!audioId) {
    return errorResponse('AudioId is required for extend', 400);
  }

  if (!sunoKey) {
    return errorResponse('API key not configured', 503);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const callBackUrl = `${supabaseUrl}/functions/v1/suno-callback`;

  const extendRes = await fetch(`${SUNO_API_BASE}/api/v1/generate/extend`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sunoKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      defaultParamFlag: true,
      audioId,
      continueAt,
      model: 'V4_5',
      callBackUrl,
      ...(prompt && { prompt }),
      ...(style && { style }),
      ...(title && { title }),
    }),
  });

  if (!extendRes.ok) {
    return errorResponse(`Extend failed: ${extendRes.status}`, 500);
  }

  const extendData = await extendRes.json();
  const taskId = extendData?.data?.taskId || extendData?.taskId;

  return successResponse({ taskId, status: 'pending' });
}

async function handleAnalyzeEmotions(user: any, supabase: any): Promise<Response> {
  const { data: scans } = await supabase
    .from('emotion_scans')
    .select('emotions, confidence, mood')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const freq: Record<string, number> = {};
  let totalIntensity = 0;
  let count = 0;

  (scans || []).forEach((s: any) => {
    if (s.emotions && typeof s.emotions === 'object') {
      const entries = Object.entries(s.emotions);
      if (entries.length > 0) {
        const [topEmotion, intensity] = entries.reduce((a, b) =>
          (a[1] as number) > (b[1] as number) ? a : b
        );
        freq[topEmotion] = (freq[topEmotion] || 0) + 1;
        totalIntensity += intensity as number;
        count++;
      }
    } else if (s.mood) {
      const mood = s.mood.toLowerCase();
      freq[mood] = (freq[mood] || 0) + 1;
      totalIntensity += s.confidence || 0.5;
      count++;
    }
  });

  const dominant = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
  const avgIntensity = count > 0 ? totalIntensity / count : 0.5;
  const profile = EMOTION_PROFILES[dominant as keyof typeof EMOTION_PROFILES] || EMOTION_PROFILES.neutral;

  return successResponse({
    dominantEmotion: dominant,
    avgIntensity,
    emotionFrequency: freq,
    recentScans: scans?.length || 0,
    musicProfile: {
      prompt: profile.prompt,
      tempo: profile.tempo,
      tags: [dominant, 'therapeutic', 'ai-generated'],
    },
  });
}

async function handleRecommendations(user: any, supabase: any): Promise<Response> {
  const { data: tracks } = await supabase
    .from('generated_music_tracks')
    .select('*')
    .eq('user_id', user.id)
    .eq('generation_status', 'complete')
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: prefs } = await supabase
    .from('user_music_preferences')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return successResponse({
    recentTracks: tracks || [],
    preferences: prefs,
    suggestedMoods: ['calm', 'focus', 'energize', 'sleep'],
  });
}

async function handleCredits(sunoKey: string | undefined): Promise<Response> {
  if (!sunoKey) {
    return successResponse({ credits: { remaining: -1, total: -1, available: false } });
  }

  try {
    const creditsRes = await fetch(`${SUNO_API_BASE}/api/v1/generate/credit`, {
      headers: { 'Authorization': `Bearer ${sunoKey}` },
    });

    if (!creditsRes.ok) {
      return successResponse({ credits: { remaining: -1, total: -1 } });
    }

    const creditsData = await creditsRes.json();
    const remaining = typeof creditsData.data === 'number' ? creditsData.data : 0;

    return successResponse({
      credits: { remaining, total: 100, plan: 'standard' },
    });
  } catch {
    return successResponse({ credits: { remaining: -1, total: -1 } });
  }
}

function handleFallback(payload: any): Response {
  const { mood = 'calm' } = payload;
  const fallback = getFallbackTrack(mood);
  return successResponse({
    isFallback: true,
    data: {
      id: fallback.id,
      audio_url: fallback.url,
      status: 'completed',
      duration: fallback.duration,
      bpm: fallback.bpm,
    },
  });
}

async function handleSavePreferences(payload: any, user: any, supabase: any): Promise<Response> {
  const { favorite_genres, preferred_tempos, favorite_moods, instrumental_preference } = payload;

  const { data, error } = await supabase
    .from('user_music_preferences')
    .upsert({
      user_id: user.id,
      favorite_genres,
      preferred_tempos,
      favorite_moods,
      instrumental_preference,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to save preferences', 500);
  }

  return successResponse({ preferences: data });
}

// ============ HELPERS ============

function getFallbackTrack(mood: string): { id: string; url: string; duration: number; bpm: number } {
  const moodKey = mood?.toLowerCase() || 'calm';
  const tracks = FALLBACK_TRACKS[moodKey] || FALLBACK_TRACKS.calm;
  const track = tracks[Math.floor(Math.random() * tracks.length)];
  return {
    id: `fallback-${moodKey}-${Date.now()}`,
    url: track.url,
    duration: track.duration,
    bpm: track.bpm,
  };
}

function successResponse(data: any): Response {
  return new Response(JSON.stringify({ success: true, ...data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
