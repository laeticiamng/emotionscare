// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, prompt, mood, sessionId, trackIds } = await req.json();
    const sunoApiKey = Deno.env.get('SUNO_API_KEY');
    
    if (!sunoApiKey) {
      throw new Error('SUNO_API_KEY not configured');
    }

    let result;
    
    switch (action) {
      case 'start':
        // Generate new music track
        const generateResponse = await fetch('https://api.suno.ai/v1/generate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sunoApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt || `therapeutic music for ${mood} mood`,
            make_instrumental: true,
            model_version: 'v3.5',
            wait_audio: false
          })
        });
        
        if (!generateResponse.ok) {
          throw new Error(`Suno API error: ${generateResponse.status}`);
        }
        
        result = await generateResponse.json();
        break;
        
      case 'status':
        // Check generation status
        const statusResponse = await fetch(`https://api.suno.ai/v1/generate/${trackIds[0]}`, {
          headers: {
            'Authorization': `Bearer ${sunoApiKey}`,
          }
        });
        
        if (!statusResponse.ok) {
          throw new Error(`Suno API error: ${statusResponse.status}`);
        }
        
        result = await statusResponse.json();
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
    console.error('Error in suno-music function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      fallback: {
        tracks: [
          { id: 'fallback-calm', url: '/audio/fallback-calm.mp3', mood: 'calm' },
          { id: 'fallback-energize', url: '/audio/fallback-energize.mp3', mood: 'energize' }
        ]
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});