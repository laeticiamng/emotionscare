
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const musicApiKey = Deno.env.get('TOPMEDIAI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emotion, mood, intensity = 0.5, style, rang = "A", lyrics } = await req.json();
    
    console.log('🎵 EmotionsCare Music Generator - Paramètres reçus:', { emotion, mood, intensity, style, rang, lyrics });

    // Génération du prompt basé sur l'émotion
    let prompt = '';
    let styleTag = style || '';
    
    switch (emotion?.toLowerCase()) {
      case 'calm':
      case 'calme':
        prompt = 'Une mélodie calm avec Relaxing calm music';
        styleTag = styleTag || 'relaxing lo-fi piano with soft beats, chill, ambient, mellow';
        break;
      case 'happy':
      case 'heureux':
        prompt = 'Une mélodie joyeuse avec Uplifting happy music';
        styleTag = styleTag || 'upbeat, cheerful, acoustic guitar, positive vibes, folk';
        break;
      case 'energetic':
      case 'énergique':
        prompt = 'Une mélodie énergique avec Energetic motivational music';
        styleTag = styleTag || 'electronic dance, upbeat tempo, synth, energetic, motivational';
        break;
      case 'sad':
      case 'triste':
        prompt = 'Une mélodie mélancolique avec Melancholic sad music';
        styleTag = styleTag || 'slow piano, melancholic, emotional, soft strings, contemplative';
        break;
      case 'anxious':
      case 'anxieux':
        prompt = 'Une mélodie apaisante pour l\'anxiété avec Soothing anxiety relief music';
        styleTag = styleTag || 'ambient, nature sounds, soft synth pads, calming, therapeutic';
        break;
      default:
        prompt = `Une mélodie ${emotion} avec Relaxing ${emotion} music`;
        styleTag = styleTag || 'ambient, relaxing, peaceful, soft instruments';
    }

    // Ajout du mood si fourni
    if (mood) {
      prompt += ` pour un état d'esprit ${mood}`;
    }

    console.log('🎼 Prompt généré:', prompt);
    console.log('🎨 Style:', styleTag);

    const requestBody = {
      callBackUrl: `${supabaseUrl}/functions/v1/emotionscare-music-generator/callback?taskId=${crypto.randomUUID()}`,
      customMode: true,
      instrumental: !lyrics,
      model: "V3_5",
      prompt: prompt,
      style: styleTag,
      title: `${rang} - Formation Médicale EmotionsCare`,
      ...(lyrics && { lyrics: lyrics })
    };

    console.log('📤 Envoi de la requête à TopMedAI:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://apibox.erweima.ai/api/v1/generate/chirp-v3-5', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${musicApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur TopMedAI:', response.status, errorText);
      throw new Error(`TopMedAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Réponse TopMedAI:', JSON.stringify(data, null, 2));

    if (!data.data?.taskId) {
      throw new Error('Invalid response: missing taskId');
    }

    const taskId = data.data.taskId;
    console.log('📋 TaskId généré:', taskId);

    // Polling pour récupérer le résultat (mode rapide)
    let attempts = 0;
    const maxAttempts = 80;
    const pollInterval = 1500; // 1.5 secondes pour mode rapide

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`🔍 Tentative ${attempts}/${maxAttempts}: Status check, Interval=${pollInterval}ms ⚡`);
      
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      
      console.log('🔍 Récupération du statut pour taskId:', taskId);
      
      const statusResponse = await fetch(`https://apibox.erweima.ai/api/v1/generate/record-info?taskId=${taskId}`, {
        headers: {
          'Authorization': `Bearer ${musicApiKey}`,
        }
      });

      console.log('📊 Status:', statusResponse.status, statusResponse.ok ? 'OK' : 'Error');
      
      if (!statusResponse.ok) {
        console.error('❌ Erreur lors de la récupération du statut');
        continue;
      }

      const responseText = await statusResponse.text();
      console.log('📥 Response text length:', responseText.length);
      
      let statusData;
      try {
        statusData = JSON.parse(responseText);
        console.log('✅ Parsed response:', JSON.stringify(statusData, null, 2));
      } catch (parseError) {
        console.error('❌ Erreur de parsing JSON:', parseError);
        continue;
      }

      if (statusData.data?.status === 'TEXT_SUCCESS' && statusData.data?.response?.sunoData) {
        console.log('📊 Nombre d\'audios (sunoData):', statusData.data.response.sunoData.length);
        
        const firstAudio = statusData.data.response.sunoData[0];
        if (firstAudio && firstAudio.streamAudioUrl) {
          console.log('📊 Premier audio - ID:', firstAudio.id, ', URL:', firstAudio.streamAudioUrl);
          console.log('✅ URL audio trouvée (structure sunoData):', firstAudio.streamAudioUrl);
          
          const result = {
            id: firstAudio.id || crypto.randomUUID(),
            title: firstAudio.title || `Musique ${emotion} EmotionsCare`,
            artist: 'EmotionsCare AI',
            url: firstAudio.streamAudioUrl,
            audioUrl: firstAudio.streamAudioUrl,
            duration: firstAudio.duration || 240,
            emotion: emotion,
            mood: mood,
            coverUrl: firstAudio.imageUrl,
            tags: styleTag
          };

          console.log('🎉 URL audio récupérée avec succès au statut TEXT_SUCCESS ⚡ RAPIDE');
          console.log(`⏱️ Génération terminée en ${attempts * (pollInterval/1000)} secondes (MODE RAPIDE ⚡)`);
          console.log(`✅ Chanson avec ${lyrics ? 'PAROLES CHANTÉES' : 'INSTRUMENTALE'} générée avec succès - ${rang} (${Math.floor((firstAudio.duration || 240)/60)}:${String((firstAudio.duration || 240) % 60).padStart(2, '0')}) en français en ${attempts * (pollInterval/1000)}s ⚡ RAPIDE`);
          console.log('🎧 URL audio:', firstAudio.streamAudioUrl);

          return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } else if (statusData.data?.status === 'PENDING') {
        console.log(`🔍 Tentative ${attempts}/${maxAttempts}: Status=PENDING, Interval=${pollInterval}ms ⚡`);
        console.log('⏳ Statut PENDING, continue le polling dans ' + pollInterval + 'ms... ⚡');
        continue;
      } else if (statusData.data?.status === 'FAILED') {
        console.error('❌ Génération échouée:', statusData.data.errorMessage);
        throw new Error(`Music generation failed: ${statusData.data.errorMessage}`);
      }
    }

    throw new Error('Timeout: Music generation took too long');

  } catch (error) {
    console.error('❌ Erreur dans emotionscare-music-generator:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Erreur lors de la génération musicale EmotionsCare'
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
