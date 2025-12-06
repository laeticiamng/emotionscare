// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emotion, intensity, userContext, mood } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Système prompt pour style Nekfeu/Kendrick Lamar adapté aux émotions
    const systemPrompt = `Tu es un expert en création de prompts musicaux pour Suno AI, spécialisé dans le rap conscient français et américain (style Nekfeu, Kendrick Lamar).

RÈGLES ABSOLUES :
1. Le style doit TOUJOURS inclure des éléments rap avec flow technique et lyrics profonds
2. Adapter le BPM, les instruments et l'atmosphère selon l'émotion
3. Utiliser des assonances et métaphores riches comme Nekfeu
4. Intégrer des références culturelles pertinentes
5. Le prompt doit être optimisé pour Suno (max 200 caractères pour style)
6. Retourner un JSON avec: style, prompt_lyrics (structure couplet/refrain), bpm, mood_tags

MAPPING ÉMOTIONS → STYLE MUSICAL :
- Calme/Relaxed: Lo-fi hip-hop, piano mélancolique, 85-95 BPM, flow posé type Nekfeu "On Verra"
- Joyeux/Happy: Boom bap ensoleillé, samples jazz, 95-105 BPM, flow énergique
- Triste/Sad: Trap émotionnelle, violon, 70-80 BPM, flow introspectif type Kendrick "u"
- Anxieux/Anxious: Ambient rap, synthés sombres, 80-90 BPM, flow nerveux
- Énergique/Energetic: Trap aggressive, 808 lourdes, 140-150 BPM, double-time flow
- Confiant/Confident: Boom bap classique, cuivres, 90-100 BPM, flow affirmé type Kendrick "DNA"
- Créatif/Creative: Jazz rap experimental, 95-110 BPM, flow technique type Nekfeu freestyles`;

    const userPrompt = `Génère un prompt musical Suno PARFAIT pour :
Émotion : ${emotion}
Intensité : ${intensity}/100
Mood : ${mood || 'non spécifié'}
Contexte utilisateur : ${userContext || 'Aucun'}

Le résultat doit être 100% personnalisé et adapté à cette personne spécifique.
Crée des lyrics avec VRAIES assonances et métaphores comme Nekfeu/Kendrick.
Structure : [Intro] [Couplet 1] [Refrain] [Couplet 2] [Refrain] [Outro]`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.9,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI generation failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parser le JSON généré
    let sunoPrompt;
    try {
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        sunoPrompt = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedContent);
      // Fallback
      sunoPrompt = {
        style: `${emotion} rap français, boom bap, piano mélancolique`,
        prompt_lyrics: generatedContent,
        bpm: 90,
        mood_tags: [emotion, 'rap', 'conscient']
      };
    }

    console.log('✅ Suno prompt generated:', sunoPrompt);

    return new Response(JSON.stringify({ 
      success: true,
      prompt: sunoPrompt,
      emotion,
      intensity
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-suno-prompt:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
