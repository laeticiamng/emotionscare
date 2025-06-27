
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
    const { lyrics, style = "ambient", rang = "A" } = await req.json();
    const topMediAiKey = Deno.env.get('TOPMEDIAI_API_KEY');

    console.log('Requête reçue:', { lyrics: lyrics?.substring(0, 100) + '...', style, rang });

    if (!topMediAiKey) {
      console.log('Clé TopMediAI manquante, utilisation du mode simulation');
      
      // Mode simulation si pas de clé API
      const mockResponse = {
        id: `sim_${Date.now()}`,
        title: `Musique ${style} générée`,
        audioUrl: `/audio/generated-${style}-${Date.now()}.mp3`,
        duration: 240,
        style: style,
        lyrics: lyrics,
        generated_at: new Date().toISOString(),
        status: 'completed'
      };

      await new Promise(resolve => setTimeout(resolve, 2000));

      return new Response(JSON.stringify({
        success: true,
        music: mockResponse,
        source: 'simulation'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Génération musique - Rang', rang, ', Style:', style);

    // Nettoyage des paroles
    const cleanLyrics = lyrics ? lyrics.replace(/[\r\n]+/g, ' ').trim() : '';
    console.log('Paroles nettoyées:', cleanLyrics.substring(0, 100) + '...');

    // Construction du prompt musical basé sur le style
    let musicPrompt = '';
    switch (style) {
      case 'lofi-piano':
        musicPrompt = 'lo-fi piano, soft jazz, relaxing, mellow, educational music, extended composition, 4 minutes, instrumental, contemplative and deep, clear melody, full composition, 240 seconds duration';
        break;
      case 'afrobeat':
        musicPrompt = 'afrobeat, energetic drums, bass guitar, rhythmic, educational music, full song structure, extended composition, instrumental, contemplative and deep, clear melody, full composition, extended track';
        break;
      case 'ambient':
        musicPrompt = 'ambient, atmospheric, calm, meditative, background music, instrumental, long form composition, peaceful, contemplative';
        break;
      default:
        musicPrompt = `${style}, instrumental, educational music, contemplative, clear melody, full composition`;
    }

    console.log('Prompt musical:', musicPrompt);

    // Appel à l'API TopMediAI
    const response = await fetch('https://api.topmediai.com/v1/music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': topMediAiKey
      },
      body: JSON.stringify({
        is_auto: 1,
        prompt: musicPrompt,
        lyrics: cleanLyrics,
        title: `Musique ${style} - ${rang}`,
        instrumental: cleanLyrics ? 0 : 1,
        model_version: "v3.5"
      })
    });

    const responseText = await response.text();
    console.log('Réponse TopMediAI:', response.status, responseText);

    if (!response.ok) {
      console.error('Erreur TopMediAI API:', response.status, responseText);
      throw new Error(`API TopMediAI: ${response.status}`);
    }

    const data = JSON.parse(responseText);

    if (data.success && data.data) {
      return new Response(JSON.stringify({
        success: true,
        music: {
          id: data.data.id || `gen_${Date.now()}`,
          title: data.data.title || `Musique ${style}`,
          audioUrl: data.data.audio_url || data.data.audioUrl,
          duration: data.data.duration || 240,
          style: style,
          lyrics: cleanLyrics,
          generated_at: new Date().toISOString(),
          status: data.data.status || 'completed',
          topmediai_id: data.data.id
        },
        source: 'topmediai'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      console.error('Réponse TopMediAI inattendue:', data);
      throw new Error('Réponse inattendue de TopMediAI');
    }

  } catch (error) {
    console.error('Erreur génération musique:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Erreur lors de la génération musicale avec TopMediAI'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
