// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MeditationRequest {
  theme: string;
  duration: number;
  voice?: string;
  language?: string;
  includeAudio?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: MeditationRequest = await req.json();
    const { theme, duration, voice = 'alloy', language = 'fr', includeAudio = true } = body;

    console.log('🧘 Generating guided meditation:', { user_id: user.id, theme, duration, voice });

    // Générer le script de méditation avec AI
    const script = await generateMeditationScript(theme, duration, language);

    let audioUrl = null;
    let audioBase64 = null;

    // Générer l'audio si demandé
    if (includeAudio && Deno.env.get('OPENAI_API_KEY')) {
      console.log('🎙️ Generating audio...');
      audioBase64 = await generateSpeech(script.fullText, voice);
    }

    // Sauvegarder dans la base de données
    const { data: meditation, error: insertError } = await supabase
      .from('guided_meditations')
      .insert({
        user_id: user.id,
        title: script.title,
        theme,
        duration,
        script: script.sections,
        full_text: script.fullText,
        voice_type: voice,
        audio_url: audioUrl,
        language,
        benefits: script.benefits,
        difficulty: script.difficulty,
        metadata: {
          word_count: script.wordCount,
          sections_count: script.sections.length,
          generated_at: new Date().toISOString(),
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error saving meditation:', insertError);
      throw insertError;
    }

    // Créer des analytics
    await supabase.from('meditation_analytics').insert({
      user_id: user.id,
      meditation_id: meditation.id,
      action: 'generated',
      duration_seconds: 0,
    });

    console.log('✅ Guided meditation generated:', meditation.id);

    return new Response(
      JSON.stringify({
        meditation,
        audioContent: audioBase64,
        message: 'Méditation guidée générée avec succès',
        tips: generateTips(theme),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Erreur interne' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generateMeditationScript(theme: string, duration: number, language: string) {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIKey) {
    // Fallback: script pré-généré
    return generateFallbackScript(theme, duration, language);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en méditation guidée. Génère un script de méditation en ${language} sur le thème "${theme}" d'une durée d'environ ${duration} secondes. Le script doit être apaisant, progressif et structuré en sections (introduction, corps, conclusion). Inclus des pauses naturelles marquées par [...].`
          },
          {
            role: 'user',
            content: `Crée une méditation guidée de ${duration} secondes sur le thème: ${theme}`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return parseScriptToSections(generatedText, theme, duration);
  } catch (error) {
    console.error('⚠️ AI generation failed, using fallback:', error);
    return generateFallbackScript(theme, duration, language);
  }
}

function parseScriptToSections(text: string, theme: string, duration: number) {
  const sections = [
    {
      title: 'Introduction',
      content: text.split('\n\n')[0] || 'Installez-vous confortablement...',
      duration: Math.floor(duration * 0.2),
    },
    {
      title: 'Corps de méditation',
      content: text.split('\n\n').slice(1, -1).join('\n\n') || 'Respirez profondément...',
      duration: Math.floor(duration * 0.6),
    },
    {
      title: 'Conclusion',
      content: text.split('\n\n').slice(-1)[0] || 'Revenez doucement à votre respiration...',
      duration: Math.floor(duration * 0.2),
    },
  ];

  return {
    title: `Méditation ${theme}`,
    sections,
    fullText: text,
    wordCount: text.split(' ').length,
    benefits: getBenefits(theme),
    difficulty: duration < 300 ? 'débutant' : duration < 600 ? 'intermédiaire' : 'avancé',
  };
}

function generateFallbackScript(theme: string, duration: number, language: string) {
  const scripts: Record<string, string> = {
    relaxation: `Installez-vous confortablement, le dos droit, les épaules détendues. [...] Fermez doucement les yeux. [...] Portez votre attention sur votre respiration naturelle. [...] Inspirez profondément par le nez, comptez jusqu'à 4. [...] Retenez votre souffle pendant 4 temps. [...] Expirez lentement par la bouche pendant 6 temps. [...] Sentez les tensions se dissoudre à chaque expiration. [...] Votre corps devient de plus en plus lourd et détendu. [...] Continuez à respirer à votre rythme. [...] Quand vous êtes prêt, ouvrez doucement les yeux.`,
    stress: `Prenez conscience de votre corps dans l'instant présent. [...] Identifiez les zones de tension. [...] Respirez profondément, en dirigeant votre souffle vers ces zones. [...] À chaque expiration, relâchez la tension. [...] Visualisez le stress qui s'évacue comme une fumée. [...] Vous êtes en sécurité, tout va bien. [...] Revenez progressivement à votre environnement.`,
    sommeil: `Allongez-vous confortablement. [...] Sentez votre corps s'enfoncer dans le matelas. [...] Relâchez vos pieds, vos jambes, votre bassin. [...] Détendez vos épaules, vos bras, vos mains. [...] Relâchez votre visage, votre mâchoire. [...] Votre respiration devient de plus en plus lente et profonde. [...] Laissez-vous glisser doucement vers le sommeil.`,
    focus: `Asseyez-vous dans une position stable et confortable. [...] Ancrez votre attention sur votre respiration. [...] Quand votre esprit divague, ramenez-le gentiment. [...] Concentrez-vous sur les sensations présentes. [...] Développez votre clarté mentale. [...] Vous êtes calme et focalisé.`,
    gratitude: `Pensez à trois choses pour lesquelles vous êtes reconnaissant aujourd'hui. [...] Ressentez la chaleur de la gratitude dans votre cœur. [...] Laissez cette sensation se propager dans tout votre corps. [...] Appréciez ce moment de paix et de reconnaissance.`,
  };

  const text = scripts[theme] || scripts.relaxation;
  return parseScriptToSections(text, theme, duration);
}

async function generateSpeech(text: string, voice: string): Promise<string | null> {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) return null;

  try {
    // Limiter le texte pour éviter les timeouts
    const limitedText = text.substring(0, 4000);

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: limitedText,
        voice: voice,
        response_format: 'mp3',
        speed: 0.9, // Vitesse légèrement réduite pour méditation
      }),
    });

    if (!response.ok) {
      console.error('❌ TTS API error:', response.status);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    return base64Audio;
  } catch (error) {
    console.error('❌ Error generating speech:', error);
    return null;
  }
}

function getBenefits(theme: string): string[] {
  const benefitsMap: Record<string, string[]> = {
    relaxation: ['Réduit le stress', 'Améliore le sommeil', 'Calme le système nerveux'],
    stress: ['Diminue l\'anxiété', 'Améliore la résilience', 'Régule les émotions'],
    sommeil: ['Facilite l\'endormissement', 'Améliore la qualité du sommeil', 'Réduit les insomnies'],
    focus: ['Améliore la concentration', 'Augmente la productivité', 'Clarifie les pensées'],
    gratitude: ['Améliore l\'humeur', 'Renforce les relations', 'Augmente le bonheur'],
  };

  return benefitsMap[theme] || ['Favorise le bien-être', 'Réduit le stress', 'Améliore la pleine conscience'];
}

function generateTips(theme: string): string[] {
  return [
    'Trouvez un endroit calme et sans distractions',
    'Utilisez des écouteurs pour une meilleure immersion',
    'Pratiquez régulièrement pour de meilleurs résultats',
    'Ne vous jugez pas si votre esprit divague',
    'Commencez par des sessions courtes et augmentez progressivement',
  ];
}
