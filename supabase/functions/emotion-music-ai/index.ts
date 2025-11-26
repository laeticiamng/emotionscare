/**
 * emotion-music-ai - Generation de musique basée sur les émotions
 *
 * 🔒 SÉCURISÉ:
 * - Authentification JWT obligatoire
 * - Rate limiting: 10 req/min (API Suno coûteuse)
 * - CORS restrictif (ALLOWED_ORIGINS)
 */

import { createClient } from '../_shared/supabase.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

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

// Helper functions for match score calculation
function extractBpmFromTags(tags: string): number | null {
  const bpmMatch = tags.match(/(\d+)\s*bpm/i);
  return bpmMatch ? parseInt(bpmMatch[1]) : null;
}

function estimateEnergyLevel(tags: string, style: string, bpm?: number): number {
  let energy = 50; // Default neutral

  const highEnergyKeywords = ['energetic', 'fast', 'intense', 'powerful', 'dynamic', 'upbeat'];
  const lowEnergyKeywords = ['calm', 'slow', 'peaceful', 'relaxing', 'gentle', 'soft'];

  const combinedText = `${tags} ${style}`.toLowerCase();

  if (highEnergyKeywords.some(kw => combinedText.includes(kw))) {
    energy += 20;
  }
  if (lowEnergyKeywords.some(kw => combinedText.includes(kw))) {
    energy -= 20;
  }

  // BPM influence
  if (bpm) {
    if (bpm < 80) energy -= 15;
    else if (bpm < 100) energy -= 5;
    else if (bpm > 140) energy += 15;
    else if (bpm > 120) energy += 5;
  }

  return Math.max(0, Math.min(100, energy));
}

// @ts-ignore - Deno.serve available at runtime in Edge Functions
Deno.serve(async (req: Request) => {
  // 1. CORS check
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  // Vérification CORS stricte
  if (!corsResult.allowed) {
    console.warn('[emotion-music-ai] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. Authentification via Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.warn('[emotion-music-ai] Unauthorized access attempt');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. 🛡️ Rate limiting (API Suno coûteuse)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'emotion-music-ai',
      userId: user.id,
      limit: 10,
      windowMs: 60_000,
      description: 'Emotion-based music generation - Suno API',
    });

    if (!rateLimit.allowed) {
      console.warn('[emotion-music-ai] Rate limit exceeded', { userId: user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
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

      (scans || []).forEach((s: any) => {
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
      const profile = PROFILES[dominant as keyof typeof PROFILES] || PROFILES.neutral;

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
      const profile = PROFILES[emotion as keyof typeof PROFILES] || PROFILES.neutral;
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
        supabaseClient.from('user_music_preferences').select('*').eq('user_id', user.id).maybeSingle(),
        supabaseClient.from('music_generation_queue').select('*').eq('user_id', user.id).eq('generation_status', 'completed').order('created_at', { ascending: false }).limit(20),
        supabaseClient.from('music_therapy_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
      ]);

      // Calculate personalized recommendations if preferences exist
      let personalizedRecommendations = [];
      if (prefs.data && tracks.data && tracks.data.length > 0) {
        const preferences = {
          favorite_genres: prefs.data.favorite_genres || [],
          preferred_tempos: prefs.data.preferred_tempos || { min: 80, max: 140 },
          favorite_moods: prefs.data.favorite_moods || [],
          listening_contexts: prefs.data.listening_contexts || [],
          preferred_energy_level: prefs.data.preferred_energy_level,
          instrumental_preference: prefs.data.instrumental_preference,
        };

        personalizedRecommendations = tracks.data
          .map((track: any) => {
            let score = 0;
            const reasons = [];
            const metadata = track.metadata || {};
            const tags = (metadata.tags || '').toLowerCase();
            const style = (metadata.style || '').toLowerCase();

            // Genre matching (40% weight)
            const genreMatch = preferences.favorite_genres.some((genre: string) =>
              tags.includes(genre.toLowerCase()) || style.includes(genre.toLowerCase())
            );
            if (genreMatch) {
              score += 0.4;
              reasons.push('Genre corresponds à vos favoris');
            }

            // Tempo matching (20% weight)
            const bpm = metadata.bpm || extractBpmFromTags(tags);
            if (bpm && preferences.preferred_tempos) {
              const { min, max } = preferences.preferred_tempos;
              if (bpm >= min && bpm <= max) {
                score += 0.2;
                reasons.push(`Tempo ${bpm} BPM dans votre plage`);
              }
            }

            // Mood matching (20% weight)
            const moodMatch = preferences.favorite_moods.some((mood: string) =>
              tags.includes(mood.toLowerCase())
            );
            if (moodMatch) {
              score += 0.2;
              reasons.push('Ambiance correspond à vos moods');
            }

            // Energy level matching (10% weight)
            if (preferences.preferred_energy_level !== undefined) {
              const trackEnergy = estimateEnergyLevel(tags, style, bpm);
              const energyDiff = Math.abs(trackEnergy - preferences.preferred_energy_level);
              const energyScore = Math.max(0, 1 - energyDiff / 100);
              score += energyScore * 0.1;
              if (energyScore > 0.7) {
                reasons.push(`Niveau d'énergie ${trackEnergy}%`);
              }
            }

            // Instrumental preference (10% weight)
            if (preferences.instrumental_preference && preferences.instrumental_preference !== 'both') {
              const hasVocals = tags.includes('vocal') || tags.includes('singing') || tags.includes('voice');
              const prefersInstrumental = preferences.instrumental_preference === 'instrumental';
              
              if ((prefersInstrumental && !hasVocals) || (!prefersInstrumental && hasVocals)) {
                score += 0.1;
                reasons.push(prefersInstrumental ? 'Format instrumental' : 'Avec voix');
              }
            }

            return {
              track,
              matchScore: Math.round(score * 100) / 100,
              matchReasons: reasons,
            };
          })
          .filter((result: any) => result.matchScore > 0.3) // Only decent matches
          .sort((a: any, b: any) => b.matchScore - a.matchScore)
          .slice(0, 10);
      }

      return new Response(JSON.stringify({
        preferences: prefs.data,
        recentTracks: tracks.data || [],
        personalizedRecommendations,
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
    const err = error as Error;
    
    // Déterminer le code de statut approprié
    let statusCode = 500;
    let errorMessage = err.message || 'Une erreur inattendue s\'est produite';
    
    // Erreurs temporaires du service
    if (errorMessage.includes('temporairement indisponible') || errorMessage.includes('503')) {
      statusCode = 503;
      errorMessage = 'Le service de génération musicale est temporairement indisponible. Veuillez réessayer dans quelques instants.';
    }
    // Erreur d'authentification
    else if (err.message?.includes('Unauthorized') || err.message?.includes('401')) {
      statusCode = 401;
    }
    // Erreur de configuration
    else if (err.message?.includes('not configured')) {
      statusCode = 500;
      errorMessage = 'Le service de génération musicale n\'est pas correctement configuré.';
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      code: statusCode,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
