import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerationRequest {
  mood: string;
  genre: string;
  energy: number;
  tempo: 'slow' | 'medium' | 'fast';
  instruments: string[];
  description?: string;
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { mood, genre, energy, tempo, instruments, description, userId }: GenerationRequest = await req.json();
    
    console.log('🎵 Génération de musique thérapeutique demandée:', { mood, genre, energy, tempo });

    // Vérification des quotas utilisateur
    const { data: quotaCheck } = await supabase
      .from('user_quotas')
      .select('monthly_music_quota, monthly_music_used')
      .eq('user_id', userId)
      .single();

    if (quotaCheck && quotaCheck.monthly_music_used >= quotaCheck.monthly_music_quota) {
      return new Response(JSON.stringify({ 
        error: 'Quota de génération musicale épuisé pour ce mois',
        quota: quotaCheck.monthly_music_quota,
        used: quotaCheck.monthly_music_used
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Construction du prompt musical thérapeutique
    const tempoMapping = {
      'slow': '60-80 BPM, rythme lent et apaisant',
      'medium': '90-110 BPM, tempo modéré et équilibré', 
      'fast': '120-140 BPM, rythme énergisant'
    };

    const moodMapping = {
      'relaxed': 'ambiance relaxante et méditative',
      'energetic': 'tonalité énergisante et motivante',
      'focused': 'atmosphère de concentration et clarté mentale',
      'happy': 'mélodie joyeuse et uplifting',
      'melancholic': 'tonalité mélancolique et introspective',
      'uplifting': 'progression harmonique inspirante et positive'
    };

    const instrumentsText = instruments.length > 0 
      ? `avec principalement : ${instruments.join(', ')}` 
      : 'avec instrumentation thérapeutique adaptée';

    const therapeuticPrompt = `
Créer une composition de musicothérapie ${genre} avec ${moodMapping[mood] || mood}.
${tempoMapping[tempo]} (${energy}% d'intensité énergétique).
${instrumentsText}.
Style thérapeutique et bien-être émotionnel.
${description ? `Ambiance spécifique : ${description}` : ''}
Production haute qualité pour usage thérapeutique.
`;

    console.log('🎼 Prompt généré:', therapeuticPrompt);

    // Appel à Suno AI pour génération musicale
    const SUNO_API_KEY = Deno.env.get('SUNO_API_KEY');
    if (!SUNO_API_KEY) {
      throw new Error('SUNO_API_KEY non configurée');
    }

    const sunoResponse = await fetch('https://api.suno.ai/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: therapeuticPrompt,
        make_instrumental: true,
        wait_audio: false
      }),
    });

    if (!sunoResponse.ok) {
      const errorText = await sunoResponse.text();
      console.error('❌ Erreur Suno AI:', errorText);
      throw new Error(`Erreur Suno AI: ${sunoResponse.status} - ${errorText}`);
    }

    const sunoData = await sunoResponse.json();
    console.log('✅ Réponse Suno AI:', sunoData);

    // Création de l'enregistrement dans la base
    const trackData = {
      id: crypto.randomUUID(),
      title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} ${genre}`,
      artist: 'EmotionsCare AI',
      duration: 180, // 3 minutes par défaut
      genre,
      mood,
      bpm: tempo === 'slow' ? 70 : tempo === 'medium' ? 100 : 130,
      energy,
      valence: energy * 0.8,
      is_generated: true,
      suno_id: sunoData.id || sunoData[0]?.id,
      audio_url: sunoData.audio_url || sunoData[0]?.audio_url,
      generation_status: 'processing',
      user_id: userId,
      generation_params: {
        mood,
        genre,
        energy,
        tempo,
        instruments,
        description,
        prompt: therapeuticPrompt
      }
    };

    // Enregistrement dans emotionscare_songs
    const { data: song, error: songError } = await supabase
      .from('emotionscare_songs')
      .insert({
        title: trackData.title,
        suno_audio_id: trackData.suno_id,
        meta: trackData.generation_params,
        lyrics: { therapeutic: true }
      })
      .select()
      .single();

    if (songError) {
      console.error('❌ Erreur insertion song:', songError);
      throw songError;
    }

    // Mise à jour du quota utilisateur
    await supabase
      .from('user_quotas')
      .upsert({
        user_id: userId,
        monthly_music_used: (quotaCheck?.monthly_music_used || 0) + 1,
        updated_at: new Date().toISOString()
      });

    console.log('🎉 Musique thérapeutique générée avec succès:', song.id);

    return new Response(JSON.stringify({
      success: true,
      track: {
        ...trackData,
        id: song.id,
        database_id: song.id
      },
      suno_response: sunoData,
      message: 'Génération musicale thérapeutique initiée avec succès'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erreur dans emotionscare-music-generator:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Erreur lors de la génération musicale thérapeutique'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});