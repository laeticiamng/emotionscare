import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, emotion_context } = await req.json();
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const systemPrompt = `Tu es un expert en analyse émotionnelle au travail. 
    Analyse le texte suivant et identifie les émotions primaires et secondaires.
    ${emotion_context ? `Contexte: ${emotion_context}` : ''}
    
    Retourne un JSON avec:
    - primary_emotion: émotion principale (joie, tristesse, colère, peur, surprise, dégoût, neutre)
    - secondary_emotions: array d'émotions secondaires
    - intensity: niveau d'intensité (1-10)
    - confidence: niveau de confiance (0-1)
    - triggers: facteurs déclencheurs identifiés
    - recommendations: suggestions d'amélioration du bien-être`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        max_completion_tokens: 512
      }),
    });

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    // Extraire le JSON de la réponse
    const jsonMatch = analysisText.match(/```json\s*([\s\S]*?)\s*```/) || 
                     analysisText.match(/{[\s\S]*?}/);
    
    let analysis;
    if (jsonMatch) {
      try {
        analysis = JSON.parse(jsonMatch[0].replace(/```json|```/g, ''));
      } catch (parseError) {
        analysis = {
          primary_emotion: 'neutre',
          secondary_emotions: [],
          intensity: 5,
          confidence: 0.5,
          triggers: ['Analyse automatique indisponible'],
          recommendations: ['Prenez un moment pour réfléchir à vos ressentis']
        };
      }
    } else {
      analysis = {
        primary_emotion: 'neutre',
        intensity: 5,
        confidence: 0.5,
        raw_analysis: analysisText
      };
    }

    return new Response(JSON.stringify({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhanced-emotion-analyze:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});