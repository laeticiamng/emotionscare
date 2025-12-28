/**
 * Suno Music - Génération de musique thérapeutique avec API Suno officielle
 * Documentation: https://docs.sunoapi.org/
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// API Base URL - https://docs.sunoapi.org/#api-base-url
const SUNO_API_BASE = 'https://api.sunoapi.org';

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
    const body = await req.json();
    const { action, prompt, mood, sessionId, trackIds, style, title, instrumental = true } = body;
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
    
    // Action: check credits
    if (action === 'credits') {
      try {
        const creditsResponse = await fetch(`${SUNO_API_BASE}/api/v1/account/info`, {
          headers: {
            'Authorization': `Bearer ${sunoApiKey}`,
          }
        });
        
        if (!creditsResponse.ok) {
          return new Response(JSON.stringify({ 
            success: false,
            error: 'Unable to fetch credits info',
            credits: { remaining: -1, total: -1 }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        const creditsData = await creditsResponse.json();
        console.log('[suno-music] Credits info:', JSON.stringify(creditsData));
        
        return new Response(JSON.stringify({ 
          success: true,
          credits: {
            remaining: creditsData.data?.credits || creditsData.credits || 0,
            total: creditsData.data?.totalCredits || creditsData.totalCredits || 0,
            plan: creditsData.data?.plan || 'unknown'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('[suno-music] Credits check error:', error);
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Credits check failed',
          credits: { remaining: -1, total: -1 }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    switch (action) {
      case 'start':
      case 'generate':
        try {
          // Documentation: https://docs.sunoapi.org/suno-api/generate-music
          const { bpmMin, bpmMax, tempo } = body;
          console.log('[suno-music] Generating with prompt:', prompt, 'BPM:', bpmMin, '-', bpmMax);
          
          const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
          const callBackUrl = `${supabaseUrl}/functions/v1/emotion-music-callback`;
          
          // Construire le style avec BPM si fourni
          let finalStyle = style || `therapeutic ${mood} ambient`;
          if (bpmMin && bpmMax) {
            finalStyle += `, tempo ${bpmMin}-${bpmMax} BPM`;
          } else if (tempo) {
            const tempoRanges: Record<string, string> = {
              slow: '60-80 BPM',
              medium: '80-100 BPM',
              fast: '100-130 BPM',
              veryfast: '130-160 BPM'
            };
            finalStyle += `, tempo ${tempoRanges[tempo] || '80-100 BPM'}`;
          }
          
          const generateResponse = await fetch(`${SUNO_API_BASE}/api/v1/generate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sunoApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customMode: true,
              instrumental: instrumental,
              model: 'V4_5', // V4_5 - Smart Prompts, up to 8 minutes
              prompt: prompt || `therapeutic relaxing instrumental music for ${mood} mood`,
              style: finalStyle,
              title: title || `${mood} - Therapeutic Music`,
              callBackUrl
            })
          });
          
          if (!generateResponse.ok) {
            const errorText = await generateResponse.text().catch(() => 'Unknown error');
            console.error(`[suno-music] Suno API error ${generateResponse.status}:`, errorText);
            
            // Fallback en cas d'erreur API
            const fallbackTrack = getFallbackTrack(mood);
            result = {
              id: fallbackTrack.id,
              audio_url: fallbackTrack.url,
              status: 'completed',
              isFallback: true,
            };
          } else {
            const sunoData = await generateResponse.json();
            console.log('[suno-music] Suno response:', JSON.stringify(sunoData));
            
            // Extract taskId from various response formats
            const taskId = sunoData?.data?.taskId 
              || sunoData?.taskId 
              || sunoData?.id 
              || sunoData?.data?.id;
            
            if (taskId) {
              result = {
                id: taskId,
                taskId: taskId,
                status: 'pending',
                isFallback: false,
              };
            } else {
              console.error('[suno-music] No taskId in response');
              const fallbackTrack = getFallbackTrack(mood);
              result = {
                id: fallbackTrack.id,
                audio_url: fallbackTrack.url,
                status: 'completed',
                isFallback: true,
              };
            }
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
        
        const taskId = trackIds[0];
        
        // Si c'est un fallback, retourner completed
        if (taskId?.startsWith('fallback-')) {
          result = { status: 'completed', isFallback: true };
        } else {
          try {
            // Documentation: https://docs.sunoapi.org/suno-api/get-music-generation-details
            const statusResponse = await fetch(
              `${SUNO_API_BASE}/api/v1/generate/record-info?taskId=${encodeURIComponent(taskId)}`, 
              {
                headers: {
                  'Authorization': `Bearer ${sunoApiKey}`,
                }
              }
            );
            
            if (!statusResponse.ok) {
              console.error(`[suno-music] Status check failed: ${statusResponse.status}`);
              result = { status: 'pending', isFallback: false };
            } else {
              const statusData = await statusResponse.json();
              console.log('[suno-music] Status response:', JSON.stringify(statusData));
              
              // Parse Suno status response
              const sunoStatus = statusData.data?.status;
              const sunoTracks = statusData.data?.response?.sunoData || [];
              const firstTrack = sunoTracks[0];
              
              // Map Suno statuses: SUCCESS, TEXT_SUCCESS = complete
              const isComplete = sunoStatus === 'SUCCESS' || sunoStatus === 'TEXT_SUCCESS';
              
              result = {
                status: isComplete ? 'completed' : (sunoStatus?.toLowerCase() || 'pending'),
                audio_url: firstTrack?.audioUrl || firstTrack?.streamAudioUrl,
                image_url: firstTrack?.imageUrl,
                duration: firstTrack?.duration,
                title: firstTrack?.title,
                isFallback: false,
              };
            }
          } catch (error) {
            console.error('[suno-music] Status check error:', error);
            result = { status: 'pending', isFallback: false };
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

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[suno-music] Error:', errorMessage);
    
    // Toujours retourner un fallback en cas d'erreur
    const fallbackTrack = getFallbackTrack('calm');
    
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
      error: errorMessage,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});