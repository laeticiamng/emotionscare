// @ts-nocheck
/**
 * Suno Music - Génération de musique thérapeutique avec fallback robuste
 * Intègre l'API Suno avec gestion d'erreurs et fallbacks gratuits
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// URLs de fallback - sons gratuits de haute qualité
const FALLBACK_TRACKS: Record<string, { url: string; duration: number; bpm: number }[]> = {
  calm: [
    { url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3', duration: 180, bpm: 60 },
    { url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_946bc51520.mp3', duration: 195, bpm: 55 },
  ],
  energize: [
    { url: 'https://cdn.pixabay.com/audio/2022/08/25/audio_4f3b0a816e.mp3', duration: 150, bpm: 120 },
    { url: 'https://cdn.pixabay.com/audio/2023/07/30/audio_e5765c3196.mp3', duration: 165, bpm: 110 },
  ],
  focus: [
    { url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8cb749d9fa.mp3', duration: 240, bpm: 80 },
    { url: 'https://cdn.pixabay.com/audio/2022/10/18/audio_a12c5a3263.mp3', duration: 200, bpm: 75 },
  ],
  sleep: [
    { url: 'https://cdn.pixabay.com/audio/2022/05/16/audio_460b6c7c2b.mp3', duration: 300, bpm: 50 },
    { url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3', duration: 280, bpm: 45 },
  ],
  meditation: [
    { url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8e92a82.mp3', duration: 120, bpm: 60 },
    { url: 'https://cdn.pixabay.com/audio/2022/10/30/audio_3b3f66f0af.mp3', duration: 180, bpm: 55 },
  ],
  anxiety: [
    { url: 'https://cdn.pixabay.com/audio/2022/05/13/audio_257112ce2f.mp3', duration: 200, bpm: 65 },
  ],
  joy: [
    { url: 'https://cdn.pixabay.com/audio/2022/08/25/audio_4f3b0a816e.mp3', duration: 150, bpm: 100 },
  ],
};

function getFallbackTrack(mood: string): { id: string; url: string; duration: number; bpm: number; mood: string } {
  const moodKey = mood?.toLowerCase() || 'calm';
  const tracks = FALLBACK_TRACKS[moodKey] || FALLBACK_TRACKS.calm;
  const track = tracks[Math.floor(Math.random() * tracks.length)];
  
  return {
    id: `fallback-${moodKey}-${Date.now()}`,
    url: track.url,
    duration: track.duration,
    bpm: track.bpm,
    mood: moodKey,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, prompt, mood, sessionId, trackIds } = await req.json();
    const sunoApiKey = Deno.env.get('SUNO_API_KEY');
    
    // Si pas de clé API, retourner directement un fallback
    if (!sunoApiKey) {
      console.log('[suno-music] No API key, using fallback tracks');
      const fallbackTrack = getFallbackTrack(mood);
      
      return new Response(JSON.stringify({ 
        success: true,
        data: {
          id: fallbackTrack.id,
          audio_url: fallbackTrack.url,
          status: 'completed',
          duration: fallbackTrack.duration,
          bpm: fallbackTrack.bpm,
        },
        isFallback: true,
        sessionId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result;
    
    switch (action) {
      case 'start':
        try {
          // Generate new music track avec Suno
          const generateResponse = await fetch('https://api.suno.ai/v1/generate', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sunoApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: prompt || `therapeutic relaxing instrumental music for ${mood} mood, no vocals`,
              make_instrumental: true,
              model_version: 'v3.5',
              wait_audio: false
            })
          });
          
          if (!generateResponse.ok) {
            console.error(`[suno-music] Suno API error: ${generateResponse.status}`);
            // Fallback en cas d'erreur API
            const fallbackTrack = getFallbackTrack(mood);
            result = {
              id: fallbackTrack.id,
              audio_url: fallbackTrack.url,
              status: 'completed',
              isFallback: true,
            };
          } else {
            result = await generateResponse.json();
          }
        } catch (apiError) {
          console.error('[suno-music] API call failed:', apiError);
          const fallbackTrack = getFallbackTrack(mood);
          result = {
            id: fallbackTrack.id,
            audio_url: fallbackTrack.url,
            status: 'completed',
            isFallback: true,
          };
        }
        break;
        
      case 'status':
        if (!trackIds || trackIds.length === 0) {
          throw new Error('No track IDs provided');
        }
        
        // Si c'est un fallback, retourner completed
        if (trackIds[0]?.startsWith('fallback-')) {
          result = { status: 'completed', isFallback: true };
        } else {
          try {
            const statusResponse = await fetch(`https://api.suno.ai/v1/generate/${trackIds[0]}`, {
              headers: {
                'Authorization': `Bearer ${sunoApiKey}`,
              }
            });
            
            if (!statusResponse.ok) {
              result = { status: 'completed', isFallback: true };
            } else {
              result = await statusResponse.json();
            }
          } catch {
            result = { status: 'completed', isFallback: true };
          }
        }
        break;

      case 'fallback':
        // Demande explicite de fallback
        const fallbackTrack = getFallbackTrack(mood);
        result = {
          id: fallbackTrack.id,
          audio_url: fallbackTrack.url,
          status: 'completed',
          duration: fallbackTrack.duration,
          bpm: fallbackTrack.bpm,
          isFallback: true,
        };
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      data: result,
      sessionId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[suno-music] Error:', error);
    
    // Toujours retourner un fallback en cas d'erreur
    const { mood = 'calm' } = await req.json().catch(() => ({}));
    const fallbackTrack = getFallbackTrack(mood);
    
    return new Response(JSON.stringify({ 
      success: true,
      data: {
        id: fallbackTrack.id,
        audio_url: fallbackTrack.url,
        status: 'completed',
        duration: fallbackTrack.duration,
        bpm: fallbackTrack.bpm,
      },
      isFallback: true,
      error: error.message,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});