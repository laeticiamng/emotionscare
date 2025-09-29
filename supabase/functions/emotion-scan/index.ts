import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, currentMood } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    let scanResult;

    if (mode === 'voice') {
      // Voice analysis simulation (would use Hume in production)
      const humeApiKey = Deno.env.get('HUME_API_KEY');
      
      if (humeApiKey) {
        // Actual Hume call would go here
        console.log('Hume voice analysis would be called here');
      }
      
      // Simulated voice analysis result
      scanResult = {
        mood: {
          valence: Math.random() * 0.6 + 0.2, // 0.2 to 0.8
          arousal: Math.random() * 0.6 + 0.2,
        },
        insight: "Votre voix révèle une journée bien remplie. Nous sentons de la détermination avec une pointe de fatigue.",
        confidence: 0.85,
        recommendations: [
          "Quelques respirations profondes pour recentrer l'énergie",
          "Une pause musicale adaptée à votre rythme",
          "Un moment de gratitude pour célébrer vos efforts"
        ]
      };
    } else if (mode === 'face') {
      // Face analysis simulation (would use computer vision in production)
      scanResult = {
        mood: {
          valence: Math.random() * 0.8 + 0.1, // 0.1 to 0.9
          arousal: Math.random() * 0.7 + 0.15,
        },
        insight: "Votre expression montre une belle authenticité. Il y a de la vie dans vos yeux, continuez à briller !",
        confidence: 0.78,
        recommendations: [
          "Gardez ce sourire intérieur qui vous caractérise",
          "Une session de musique énergisante pourrait amplifier cette belle énergie",
          "Partagez cette bonne humeur avec vos proches"
        ]
      };
    } else {
      // Mood cards - already handled on frontend
      scanResult = {
        mood: currentMood,
        insight: "Merci pour cette sincérité. Nous adaptons votre expérience à votre état actuel.",
        confidence: 1.0,
        recommendations: [
          "Explorer les activités suggérées",
          "Prendre le temps qu'il faut pour vous",
          "Se rappeler que chaque état est temporaire et valide"
        ]
      };
    }

    // Store the scan result
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      
      if (user) {
        // Update mood state
        await supabase.from('user_mood_states').upsert({
          user_id: user.id,
          valence: scanResult.mood.valence,
          arousal: scanResult.mood.arousal,
          source: mode,
          confidence: scanResult.confidence,
        });

        // Log activity
        await supabase.from('activity_logs').insert({
          user_id: user.id,
          route: '/scan',
          page_key: 'emotion_scan',
          context: {
            scan_mode: mode,
            mood_result: scanResult.mood,
            insight: scanResult.insight
          }
        });

        // Emit mood event
        await supabase.from('mood_events').insert({
          user_id: user.id,
          event_type: 'mood_updated',
          payload: {
            source: 'emotion_scan',
            mode: mode,
            mood: scanResult.mood
          }
        });
      }
    }

    return new Response(JSON.stringify(scanResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in emotion-scan function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur temporaire du scanner',
      fallback: {
        mood: { valence: 0.5, arousal: 0.5 },
        insight: "Nous rencontrons une difficulté technique, mais votre bien-être reste notre priorité.",
        recommendations: ["Réessayer dans quelques instants", "Utiliser les mood cards", "Prendre une respiration profonde"]
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});