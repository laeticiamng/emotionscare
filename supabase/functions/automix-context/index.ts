// @ts-nocheck
/**
 * AutoMix Context - Récupération du contexte utilisateur
 * Météo, heure, localisation pour générer playlist adaptée
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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

    // Récupérer les préférences utilisateur
    const { data: prefs } = await supabaseClient
      .from('user_context_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Déterminer l'émotion recommandée basée sur le contexte
    let recommendedMood = 'calm';
    let recommendedTempo = 90;

    if (prefs) {
      if (timeContext === 'morning') {
        recommendedMood = prefs.morning_mood || 'energetic';
        recommendedTempo = prefs.preferred_tempo_morning || 120;
      } else if (timeContext === 'afternoon') {
        recommendedMood = prefs.afternoon_mood || 'calm';
        recommendedTempo = prefs.preferred_tempo_afternoon || 90;
      } else {
        recommendedMood = prefs.evening_mood || 'relaxing';
        recommendedTempo = prefs.preferred_tempo_evening || 70;
      }

      // Ajuster selon la météo si activé
      if (prefs.weather_sensitivity) {
        if (weatherContext === 'rainy') recommendedMood = 'melancholic';
        else if (weatherContext === 'sunny' && temperature > 25) recommendedMood = 'energetic';
        else if (weatherContext === 'stormy') recommendedMood = 'intense';
      }
    }

    return new Response(JSON.stringify({
      timeContext,
      weatherContext,
      temperature,
      recommendedMood,
      recommendedTempo,
      hour,
      contextDescription: `${timeContext} • ${weatherContext} • ${temperature}°C`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[automix-context]', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
