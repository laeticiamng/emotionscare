
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
    const { userId, emotionResult } = await req.json();

    if (!userId || !emotionResult) {
      return new Response(
        JSON.stringify({ error: 'UserId and emotionResult are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Calculate points based on emotion intensity and confidence
    const basePoints = Math.round(emotionResult.intensity * 10);
    const confidenceBonus = Math.round(emotionResult.confidence * 5);
    const totalPoints = basePoints + confidenceBonus;

    // Simulate gamification processing
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

    // Check for streak milestones and badge achievements
    if (totalPoints >= 50) {
      gamificationUpdate.badges.push('High Intensity Scan');
    }
    
    if (emotionResult.confidence >= 0.9) {
      gamificationUpdate.badges.push('Confident Analysis');
    }

    // Simulate positive emotion bonus
    const positiveEmotions = ['joy', 'happiness', 'contentment', 'excitement', 'gratitude'];
    if (positiveEmotions.includes(emotionResult.emotion.toLowerCase())) {
      gamificationUpdate.pointsEarned += 5;
      gamificationUpdate.badges.push('Positive Vibes');
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
