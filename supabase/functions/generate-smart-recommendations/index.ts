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
    const { primaryEmotion, emotionVector, confidence, context } = await req.json();
    
    console.log('💡 Génération recommandations pour:', primaryEmotion);

    // Recommandations intelligentes basées sur l'émotion
    const recommendations = [
      {
        id: `rec_${Date.now()}_1`,
        type: 'breathing',
        priority: 'high',
        title: 'Respiration 4-7-8',
        description: 'Technique de respiration pour retrouver votre calme',
        targetEmotion: primaryEmotion,
        expectedOutcome: 'contentment',
        effectiveness: 85,
        duration: 5,
        difficulty: 'beginner',
        personalizedScore: confidence * 100,
        usageCount: 0,
        successRate: 0.85
      },
      {
        id: `rec_${Date.now()}_2`,
        type: 'music',
        priority: 'medium',
        title: 'Playlist thérapeutique',
        description: 'Musique adaptée à votre état émotionnel',
        targetEmotion: primaryEmotion,
        expectedOutcome: 'serenity',
        effectiveness: 90,
        duration: 15,
        difficulty: 'beginner',
        personalizedScore: confidence * 95,
        usageCount: 0,
        successRate: 0.90
      }
    ];

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erreur recommandations:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});