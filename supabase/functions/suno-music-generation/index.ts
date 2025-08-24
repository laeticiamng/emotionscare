import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MusicGenerationRequest {
  prompt: string;
  make_instrumental?: boolean;
  model?: string;
  wait_audio?: boolean;
  tags?: string;
  title?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const sunoApiKey = Deno.env.get('SUNO_API_KEY');
  if (!sunoApiKey) {
    return new Response(JSON.stringify({ 
      error: 'Suno API key not configured',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json() as MusicGenerationRequest;
    console.log('🎵 Generating music with Suno API:', body);

    // Valeurs par défaut
    const musicRequest = {
      prompt: body.prompt,
      make_instrumental: body.make_instrumental ?? false,
      model: body.model ?? 'chirp-v3-5',
      wait_audio: body.wait_audio ?? true,
      tags: body.tags ?? 'therapeutic, ambient, healing',
      title: body.title ?? undefined
    };

    console.log('📤 Sending request to Suno API:', musicRequest);

    // Appel à l'API Suno via sunoapi.org
    const response = await fetch('https://api.sunoapi.org/api/v1/music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sunoApiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(musicRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Suno API error:', response.status, errorText);
      
      return new Response(JSON.stringify({
        success: false,
        error: `Suno API error: ${response.status}`,
        details: errorText
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await response.json();
    console.log('✅ Suno API response:', result);

    // Format de réponse standardisé
    const formattedResponse = {
      success: true,
      data: {
        id: result.id || result.taskId,
        title: result.title,
        audio_url: result.audio_url,
        video_url: result.video_url,
        image_url: result.image_url,
        lyric: result.lyric,
        tags: result.tags,
        prompt: result.prompt,
        duration: result.duration,
        status: result.status,
        created_at: result.created_at,
        model: result.model
      },
      metadata: {
        model_used: musicRequest.model,
        is_instrumental: musicRequest.make_instrumental,
        generated_at: new Date().toISOString()
      }
    };

    return new Response(JSON.stringify(formattedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Music generation error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});