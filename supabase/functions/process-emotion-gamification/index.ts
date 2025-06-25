
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { userId, emotionResult } = await req.json();

    if (!userId || !emotionResult) {
      throw new Error('UserId and emotionResult are required');
    }

    // Calculer les points basés sur l'intensité et la confiance émotionnelle
    const basePoints = Math.round(emotionResult.intensity * 10);
    const confidenceBonus = Math.round(emotionResult.confidence * 5);
    const totalPoints = basePoints + confidenceBonus;

    // Simuler le processus de gamification
    const gamificationUpdate = {
      userId,
      pointsEarned: totalPoints,
      emotion: emotionResult.emotion,
      intensity: emotionResult.intensity,
      confidence: emotionResult.confidence,
      timestamp: new Date().toISOString(),
      streakIncrement: 1,
      badges: []
    };

    // Vérifier les jalons de streak et les réalisations de badge
    if (totalPoints >= 50) {
      gamificationUpdate.badges.push('High Intensity Scan');
    }
    
    if (emotionResult.confidence >= 0.9) {
      gamificationUpdate.badges.push('Confident Analysis');
    }

    // Bonus pour les émotions positives
    const positiveEmotions = ['joy', 'happiness', 'contentment', 'excitement', 'gratitude'];
    if (positiveEmotions.includes(emotionResult.emotion.toLowerCase())) {
      gamificationUpdate.pointsEarned += 5;
      gamificationUpdate.badges.push('Positive Vibes');
    }

    // Enregistrer les badges dans Supabase si applicable
    if (gamificationUpdate.badges.length > 0) {
      for (const badgeName of gamificationUpdate.badges) {
        await supabase
          .from('badges')
          .insert({
            user_id: userId,
            name: badgeName,
            description: `Obtenu pour: ${emotionResult.emotion}`,
            image_url: `/badges/${badgeName.toLowerCase().replace(/\s+/g, '-')}.png`
          });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        gamificationUpdate
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-emotion-gamification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
