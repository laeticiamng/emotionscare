// @ts-nocheck
/**
 * AutoMix Context - Analyse contextuelle intelligente via OpenAI
 * Météo, heure, localisation pour générer recommandations musicales
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const ALLOWED_ORIGINS = [
  'https://emotionscare.com',
  'https://www.emotionscare.com',
  'https://emotions-care.lovable.app',
  'http://localhost:5173',
];

function getCorsHeaders(req) {
  const origin = req.headers.get('origin') ?? '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: getCorsHeaders(req) });

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const { latitude, longitude } = await req.json();

    // Récupérer l'heure locale
    const now = new Date();
    const hour = now.getHours();
    let timeContext = 'evening';
    if (hour >= 5 && hour < 12) timeContext = 'morning';
    else if (hour >= 12 && hour < 18) timeContext = 'afternoon';

    // Récupérer la météo via OpenWeather API
    let weatherContext = 'neutral';
    let temperature = 20;
    
    if (latitude && longitude) {
      const weatherKey = Deno.env.get('OPENWEATHER_API_KEY');
      if (weatherKey) {
        try {
          const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherKey}&units=metric`
          );
          const weatherData = await weatherRes.json();
          
          temperature = weatherData.main?.temp || 20;
          const condition = weatherData.weather?.[0]?.main?.toLowerCase();
          
          // Mapper conditions météo à contextes émotionnels
          if (condition === 'rain' || condition === 'drizzle') weatherContext = 'rainy';
          else if (condition === 'clear' || condition === 'sunny') weatherContext = 'sunny';
          else if (condition === 'clouds') weatherContext = 'cloudy';
          else if (condition === 'snow') weatherContext = 'snowy';
          else if (condition === 'thunderstorm') weatherContext = 'stormy';
        } catch (error) {
          console.log('Weather fetch failed:', error);
        }
      }
    }

    // Récupérer les préférences utilisateur et historique de feedback
    const { data: prefs } = await supabaseClient
      .from('user_context_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Récupérer les 10 derniers feedbacks pour affiner les recommandations
    const { data: recentFeedback } = await supabaseClient
      .from('automix_feedback')
      .select('rating, context_snapshot')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Utiliser OpenAI pour analyser le contexte et générer des recommandations
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const feedbackSummary = prefs?.feedback_summary || {};
    const contextPrompt = `Tu es un expert en musicothérapie et recommandations musicales personnalisées.

Contexte actuel :
- Heure : ${hour}h (${timeContext})
- Météo : ${weatherContext}, ${temperature}°C
- Préférences utilisateur : ${prefs ? JSON.stringify(prefs, null, 2) : 'Aucune préférence définie'}

Historique de feedback utilisateur (apprentissage progressif) :
- Total likes : ${feedbackSummary.total_likes || 0}
- Total dislikes : ${feedbackSummary.total_dislikes || 0}
- Humeurs préférées : ${feedbackSummary.preferred_moods?.join(', ') || 'Non défini'}
- Humeurs évitées : ${feedbackSummary.avoided_moods?.join(', ') || 'Non défini'}
- Tempos préférés : ${feedbackSummary.preferred_tempos?.join(', ') || 'Non défini'}
- Corrélations météo : ${JSON.stringify(feedbackSummary.weather_correlations || {})}

Feedbacks récents (contexte détaillé) :
${recentFeedback?.map(f => `- ${f.rating === 1 ? '👍' : '👎'} ${JSON.stringify(f.context_snapshot)}`).join('\n') || 'Aucun feedback'}

INSTRUCTIONS CRITIQUES :
1. Utilise IMPÉRATIVEMENT l'historique de feedback pour affiner ta recommandation
2. Évite les humeurs et tempos qui ont reçu des dislikes
3. Favorise les combinaisons qui ont reçu des likes
4. Prends en compte les corrélations météo apprises
5. Adapte-toi progressivement aux préférences uniques de l'utilisateur

Recommande :
1. L'émotion/mood musicale idéale (calm, energetic, joyful, melancholic, relaxing, focused, creative, healing)
2. Le tempo optimal (BPM entre 60-140)
3. Une brève explication de ton choix basée sur l'apprentissage (1 phrase)

Réponds en JSON avec cette structure exacte :
{
  "recommendedMood": "...",
  "recommendedTempo": 90,
  "reasoning": "..."
}`;

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un assistant expert en musicothérapie. Réponds uniquement en JSON valide.' },
          { role: 'user', content: contextPrompt }
        ],
        max_completion_tokens: 200,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`OpenAI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    // Parser la réponse JSON
    let aiRecommendation;
    try {
      aiRecommendation = JSON.parse(aiContent);
    } catch (e) {
      console.error('Failed to parse AI response:', aiContent);
      // Fallback en cas d'échec
      aiRecommendation = {
        recommendedMood: 'calm',
        recommendedTempo: 90,
        reasoning: 'Recommandation par défaut'
      };
    }

    return new Response(JSON.stringify({
      timeContext,
      weatherContext,
      temperature,
      recommendedMood: aiRecommendation.recommendedMood,
      recommendedTempo: aiRecommendation.recommendedTempo,
      reasoning: aiRecommendation.reasoning,
      hour,
      contextDescription: `${timeContext} • ${weatherContext} • ${temperature}°C`
    }), {
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[automix-context]', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});
