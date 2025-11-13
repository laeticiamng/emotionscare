// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction retry avec backoff exponentiel pour gérer les erreurs temporaires
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Si succès ou erreur non-temporaire, retourner directement
      if (response.ok || ![502, 503, 504, 429].includes(response.status)) {
        return response;
      }
      
      // Erreur temporaire, on va retry
      lastError = new Error(`Temporary error ${response.status}`);
      
      // Attendre avant de retry (backoff exponentiel: 1s, 2s, 4s)
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`[emotion-music-ai] Retry ${attempt + 1}/${maxRetries} after ${delay}ms for status ${response.status}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`[emotion-music-ai] Retry ${attempt + 1}/${maxRetries} after ${delay}ms for error:`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

const PROFILES = {
  joy: { prompt: "Uplifting bright energetic therapeutic music", tempo: 120, desc: "Musique joyeuse" },
  calm: { prompt: "Peaceful ambient soft relaxing music", tempo: 60, desc: "Musique apaisante" },
  sad: { prompt: "Melancholic comforting emotional music", tempo: 70, desc: "Musique réconfortante" },
  anger: { prompt: "Intense cathartic transformative music", tempo: 100, desc: "Musique cathartique" },
  anxious: { prompt: "Grounding calming reassuring music", tempo: 65, desc: "Musique rassurante" },
  energetic: { prompt: "Dynamic motivating powerful music", tempo: 130, desc: "Musique dynamique" },
  neutral: { prompt: "Balanced peaceful harmonious music", tempo: 90, desc: "Musique équilibrée" }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { action, emotion, customPrompt, sunoTaskId, trackId, skipQueue = false } = body;
    const sunoKey = Deno.env.get('SUNO_API_KEY');
    if (!sunoKey) throw new Error('SUNO_API_KEY not configured');

    // Vérifier le statut de l'API si pas en mode skipQueue
    if (!skipQueue && action === 'generate') {
      const { data: apiStatus } = await supabaseClient
        .from('suno_api_status')
        .select('*')
        .order('last_check', { ascending: false })
        .limit(1)
        .single();

      // Si l'API est indisponible, ajouter à la queue
      if (apiStatus && !apiStatus.is_available && apiStatus.consecutive_failures >= 2) {
        console.log('[emotion-music-ai] API unavailable, adding to queue');

        const { data: queueItem, error: queueError } = await supabaseClient
          .from('music_generation_queue')
          .insert({
            user_id: user.id,
            emotion,
            intensity: 0.5,
            mood: customPrompt,
            status: 'pending',
          })
          .select()
          .single();

        if (queueError) throw queueError;

        return new Response(JSON.stringify({
          success: true,
          queued: true,
          queueId: queueItem.id,
          message: 'Demande ajoutée à la file d\'attente',
          estimatedWaitMinutes: 2,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Analyser émotions
    if (action === 'analyze-emotions') {
      const { data: scans } = await supabaseClient
        .from('emotion_scans')
        .select('emotions, confidence, mood')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const freq: Record<string, number> = {};
      let totalIntensity = 0;
      let count = 0;

      (scans || []).forEach(s => {
        // emotions est un objet JSON avec les émotions détectées
        if (s.emotions && typeof s.emotions === 'object') {
          // Prendre l'émotion dominante du scan
          const emotionEntries = Object.entries(s.emotions);
          if (emotionEntries.length > 0) {
            // Trouver l'émotion avec la plus haute valeur
            const [topEmotion, intensity] = emotionEntries.reduce((a, b) => 
              (a[1] as number) > (b[1] as number) ? a : b
            );
            freq[topEmotion] = (freq[topEmotion] || 0) + 1;
            totalIntensity += (intensity as number);
            count++;
          }
        } else if (s.mood) {
          // Fallback sur mood si emotions n'est pas disponible
          const mood = s.mood.toLowerCase();
          freq[mood] = (freq[mood] || 0) + 1;
          totalIntensity += (s.confidence || 0.5);
          count++;
        }
      });

      const dominant = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
      const avgIntensity = count > 0 ? totalIntensity / count : 0.5;
      const profile = PROFILES[dominant] || PROFILES.neutral;

      return new Response(JSON.stringify({
        dominantEmotion: dominant,
        avgIntensity,
        emotionFrequency: freq,
        recentScans: scans?.length || 0,
        musicProfile: {
          prompt: profile.prompt,
          tempo: profile.tempo,
          tags: [dominant, 'therapeutic', 'ai-generated'],
          description: profile.desc
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Générer musique
    if (action === 'generate-music') {
      const profile = PROFILES[emotion] || PROFILES.neutral;
      const prompt = customPrompt || profile.prompt;

      console.log(`[emotion-music-ai] Generating music for emotion: ${emotion}`);
      
      // Utiliser fetchWithRetry pour gérer les erreurs temporaires
      const sunoRes = await fetchWithRetry('https://api.suno.ai/v1/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sunoKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, make_instrumental: true, wait_audio: false })
      }, 3);

      if (!sunoRes.ok) {
        const errorBody = await sunoRes.text().catch(() => 'No error details');
        console.error(`[emotion-music-ai] Suno API error ${sunoRes.status}:`, errorBody);
        
        // Erreurs temporaires (service unavailable, rate limit, gateway error)
        if ([502, 503, 504, 429].includes(sunoRes.status)) {
          return new Response(JSON.stringify({ 
            error: 'SERVICE_UNAVAILABLE',
            message: 'Le service de génération musicale est temporairement indisponible. Veuillez réessayer dans quelques instants.',
            status: sunoRes.status
          }), {
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        // Erreur d'authentification
        if (sunoRes.status === 401 || sunoRes.status === 403) {
          return new Response(JSON.stringify({ 
            error: 'AUTH_ERROR',
            message: 'Erreur d\'authentification avec le service de génération musicale.'
          }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        // Autres erreurs
        return new Response(JSON.stringify({ 
          error: 'GENERATION_ERROR',
          message: `Erreur du service de génération musicale: ${sunoRes.status}`
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const sunoData = await sunoRes.json();
      console.log(`[emotion-music-ai] Suno generation started:`, sunoData.id);

      const { data: track } = await supabaseClient
        .from('generated_music_tracks')
        .insert({
          user_id: user.id,
          emotion,
          prompt,
          original_task_id: sunoData.id,
          generation_status: 'pending',
          metadata: { profile }
        })
        .select()
        .single();

      const { data: session } = await supabaseClient
        .from('music_therapy_sessions')
        .insert({ user_id: user.id, emotion_before: emotion, track_id: track?.id })
        .select()
        .single();

      return new Response(JSON.stringify({
        success: true,
        taskId: sunoData.id,
        trackId: track?.id,
        sessionId: session?.id,
        emotion,
        profile,
        status: 'generating'
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Check status
    if (action === 'check-status') {
      const statusRes = await fetch(`https://api.suno.ai/v1/generate/${sunoTaskId}`, {
        headers: { 'Authorization': `Bearer ${sunoKey}` }
      });

      if (!statusRes.ok) {
        console.error(`[emotion-music-ai] Status check failed: ${statusRes.status}`);
        
        // Erreurs temporaires
        if ([502, 503, 504, 429].includes(statusRes.status)) {
          throw new Error('Le service de génération musicale est temporairement indisponible. Réessayez dans quelques instants.');
        }
        
        throw new Error(`Erreur lors de la vérification du statut: ${statusRes.status}`);
      }
      const statusData = await statusRes.json();

      if (statusData.status === 'complete' && statusData.audio_url && trackId) {
        await supabaseClient
          .from('generated_music_tracks')
          .update({
            audio_url: statusData.audio_url,
            image_url: statusData.image_url,
            duration: statusData.duration,
            generation_status: 'complete'
          })
          .eq('id', trackId);
      }

      return new Response(JSON.stringify({
        success: true,
        status: statusData.status,
        audio_url: statusData.audio_url,
        image_url: statusData.image_url
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Recommendations
    if (action === 'get-recommendations') {
      const [prefs, tracks, sessions] = await Promise.all([
        supabaseClient.from('user_music_preferences').select('*').eq('user_id', user.id).single(),
        supabaseClient.from('generated_music_tracks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
        supabaseClient.from('music_therapy_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
      ]);

      return new Response(JSON.stringify({
        preferences: prefs.data,
        recentTracks: tracks.data || [],
        sessions: sessions.data || [],
        totalGenerated: tracks.data?.length || 0
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[emotion-music-ai] Error:', error);
    
    // Déterminer le code de statut approprié
    let statusCode = 500;
    let errorMessage = error.message || 'Une erreur inattendue s\'est produite';
    
    // Erreurs temporaires du service
    if (errorMessage.includes('temporairement indisponible') || errorMessage.includes('503')) {
      statusCode = 503;
      errorMessage = 'Le service de génération musicale est temporairement indisponible. Veuillez réessayer dans quelques instants.';
    }
    // Erreur d'authentification
    else if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
      statusCode = 401;
    }
    // Erreur de configuration
    else if (error.message?.includes('not configured')) {
      statusCode = 500;
      errorMessage = 'Le service de génération musicale n\'est pas correctement configuré.';
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      code: statusCode,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
