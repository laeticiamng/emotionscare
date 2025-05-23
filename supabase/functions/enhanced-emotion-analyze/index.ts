
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authorizeRole } from "../_shared/auth.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { emojis, text, audio_url, facial_expression } = await req.json();
    
    // Construct comprehensive prompt for enhanced analysis
    let prompt = "Tu es un expert en analyse émotionnelle pour les professionnels de santé. Analyse les éléments suivants pour fournir un diagnostic émotionnel précis:\n\n";
    
    if (emojis && emojis.length > 0) {
      prompt += `Emojis sélectionnés: ${emojis}\n`;
    }
    if (text && text.length > 0) {
      prompt += `Expression textuelle: "${text}"\n`;
    }
    if (audio_url) {
      prompt += `Message vocal enregistré (analyse tonale disponible)\n`;
    }
    if (facial_expression) {
      prompt += `Expression faciale détectée: ${facial_expression}\n`;
    }

    // Enhanced analysis prompt
    prompt += `\nFournis une analyse détaillée incluant:
1. Score émotionnel global (0-100)
2. Émotions primaires et secondaires détectées
3. Niveau de stress perçu
4. Recommandations personnalisées pour l'amélioration du bien-être
5. Actions immédiates suggérées

Format de sortie: JSON avec les champs suivants:
- score: nombre entre 0 et 100
- primary_emotion: émotion principale détectée
- secondary_emotions: array des émotions secondaires
- stress_level: niveau de stress (low/medium/high)
- ai_feedback: feedback détaillé et bienveillant
- recommendations: array de recommandations pratiques
- immediate_actions: array d'actions immédiates`;

    console.log('Calling OpenAI for enhanced emotion analysis');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un psychologue spécialisé en bien-être des professionnels de santé.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    console.log('OpenAI response received for enhanced analysis');

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }

    // Parse the enhanced analysis result
    let analysisResult;
    try {
      analysisResult = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
      // Enhanced fallback response
      analysisResult = {
        score: 50,
        primary_emotion: 'neutral',
        secondary_emotions: ['uncertainty'],
        stress_level: 'medium',
        ai_feedback: "Notre système d'analyse avancée rencontre actuellement des difficultés. Votre expression émotionnelle a été enregistrée et sera analysée dès que possible.",
        recommendations: [
          "Prenez quelques minutes pour respirer profondément",
          "Hydratez-vous régulièrement",
          "Planifiez une courte pause dans votre journée"
        ],
        immediate_actions: [
          "Respiration consciente pendant 2 minutes",
          "Étirement léger des épaules et du cou"
        ]
      };
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced-emotion-analyze function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      score: 50,
      primary_emotion: 'neutral',
      ai_feedback: "Une erreur est survenue lors de l'analyse avancée. Votre bien-être reste notre priorité - prenez un moment pour vous recentrer."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
