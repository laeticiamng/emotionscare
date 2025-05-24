
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
    const { text, emojis, userId } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Construire le prompt d'analyse
    let analysisPrompt = `Analyse l'état émotionnel basé sur ces données :
    
    Texte : "${text}"
    Émojis sélectionnés : ${emojis.join(' ')}
    
    Fournis une analyse structurée avec :
    1. Émotion principale (un mot : Joyeux, Triste, Anxieux, Colère, Calme, etc.)
    2. Niveau de confiance (0-1)
    3. Intensité émotionnelle (1-10)
    4. Analyse détaillée (2-3 phrases)
    5. 3 recommandations pratiques
    
    Réponds en JSON avec cette structure :
    {
      "emotion": "string",
      "confidence": number,
      "intensity": number,
      "analysis": "string",
      "recommendations": ["string", "string", "string"]
    }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en analyse émotionnelle. Réponds uniquement en JSON valide.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    try {
      const analysisResult = JSON.parse(aiResponse);
      return new Response(
        JSON.stringify(analysisResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      // Fallback si le JSON n'est pas valide
      return new Response(
        JSON.stringify({
          emotion: 'Neutre',
          confidence: 0.7,
          intensity: 5,
          analysis: 'Analyse en cours de traitement...',
          recommendations: [
            'Prenez quelques minutes pour respirer profondément',
            'Notez vos sentiments dans votre journal',
            'Pratiquez une courte méditation'
          ]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in analyze-emotion function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        emotion: 'Erreur',
        confidence: 0,
        intensity: 0,
        analysis: 'Une erreur est survenue lors de l\'analyse.',
        recommendations: []
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
