import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authorizeRole } from '../_shared/auth.ts';

const sunoApiKey = Deno.env.get('SUNO_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emotion, mood, intensity, style, lyrics } = await req.json();

    if (!sunoApiKey) {
      throw new Error('SUNO API key not configured');
    }

    console.log('🎵 Génération SUNO:', { emotion, mood, intensity, style });

    // Construire le prompt pour SUNO
    let prompt = `${emotion} ${mood} music`;
    if (style) {
      prompt += ` in ${style} style`;
    }
    
    // Ajuster l'intensité
    const intensityDescriptors = {
      low: 'gentle, soft',
      medium: 'moderate, balanced',
      high: 'intense, energetic'
    };
    
    const intensityLevel = intensity < 0.3 ? 'low' : intensity > 0.7 ? 'high' : 'medium';
    prompt += `, ${intensityDescriptors[intensityLevel]}`;

    // Appel à l'API SUNO
    const sunoResponse = await fetch('https://api.suno.ai/v1/songs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sunoApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        lyrics: lyrics || undefined,
        make_instrumental: !lyrics,
        wait_audio: true
      }),
    });

    if (!sunoResponse.ok) {
      const errorText = await sunoResponse.text();
      throw new Error(`SUNO API error: ${sunoResponse.status} - ${errorText}`);
    }

    const sunoData = await sunoResponse.json();
    console.log('✅ Réponse SUNO:', sunoData);

    // Transformer la réponse SUNO au format attendu
    const track = {
      id: sunoData.id || crypto.randomUUID(),
      title: sunoData.title || `Musique ${emotion}`,
      artist: 'SUNO AI',
      url: sunoData.audio_url || sunoData.url,
      audioUrl: sunoData.audio_url || sunoData.url,
      duration: sunoData.duration || 120,
      emotion: emotion,
      mood: mood,
      coverUrl: sunoData.image_url || sunoData.cover_url,
      tags: prompt
    };

    return new Response(JSON.stringify(track), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erreur SUNO:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Erreur lors de la génération musicale SUNO'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});