
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
    const sunoApiKey = Deno.env.get('SUNO_API_KEY');

    console.log('🎵 Requête génération musique Suno reçue:', {
      lyricsLength: lyrics?.length || 0,
      style,
      rang,
      lyricsPreview: lyrics?.substring(0, 100) + '...'
    });

    if (!sunoApiKey) {
      console.log('⚠️ Clé Suno API manquante, utilisation du mode simulation');
      
      // Mode simulation si pas de clé API
      const mockResponse = {
        id: `suno_sim_${Date.now()}`,
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

    console.log('🎤 Soumission à Suno AI - Rang', rang);

    // Nettoyage des paroles
    const cleanLyrics = lyrics ? lyrics.replace(/[\r\n]+/g, ' ').trim() : '';
    console.log('📖 Paroles (', cleanLyrics.length, 'caractères):', cleanLyrics.substring(0, 100) + '...');

    // Construction du prompt musical basé sur le style
    let musicPrompt = '';
    switch (style) {
      case 'lofi-piano':
        musicPrompt = 'lo-fi piano, soft jazz, relaxing, mellow, contemplative, clear melody';
        break;
      case 'afrobeat':
        musicPrompt = 'afrobeat, energetic drums, bass guitar, rhythmic, uplifting';
        break;
      case 'jazz-moderne':
        musicPrompt = 'modern jazz, saxophone, piano, smooth rhythms, sophisticated';
        break;
      case 'ambient':
        musicPrompt = 'ambient, atmospheric, calm, meditative, peaceful';
        break;
      default:
        musicPrompt = `${style}, melodic, harmonious`;
    }

    console.log('🎵 Prompt musical Suno:', musicPrompt);

    // Appel à l'API Suno pour générer la musique
    const sunoResponse = await fetch('https://api.suno.ai/v1/songs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sunoApiKey}`
      },
      body: JSON.stringify({
        title: `Musique ${style} - ${rang}`,
        tags: musicPrompt,
        prompt: cleanLyrics || musicPrompt,
        make_instrumental: !cleanLyrics,
        wait_audio: true
      })
    });

    const responseText = await sunoResponse.text();
    console.log('📡 Réponse Suno API:', sunoResponse.status, responseText.substring(0, 500));

    if (!sunoResponse.ok) {
      console.error('❌ Erreur Suno API:', sunoResponse.status, responseText);
      throw new Error(`API Suno: ${sunoResponse.status} - ${responseText}`);
    }

    const sunoData = JSON.parse(responseText);

    // Suno retourne généralement un tableau de chansons
    const song = Array.isArray(sunoData) ? sunoData[0] : sunoData;

    if (song && (song.audio_url || song.url)) {
      console.log('✅ Chanson générée avec succès via Suno - Rang', rang);
      
      return new Response(JSON.stringify({
        success: true,
        music: {
          id: song.id || `suno_${Date.now()}`,
          title: song.title || `Musique ${style}`,
          audioUrl: song.audio_url || song.url,
          duration: song.duration || 240,
          style: style,
          lyrics: cleanLyrics,
          generated_at: new Date().toISOString(),
          status: song.status || 'completed',
          suno_id: song.id,
          image_url: song.image_url
        },
        source: 'suno'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      console.error('❌ Réponse Suno inattendue:', sunoData);
      throw new Error('Réponse inattendue de Suno AI');
    }

  } catch (error) {
    console.error('❌ Erreur génération musique Suno:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Erreur lors de la génération musicale avec Suno AI'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
