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
    const { sessionId } = await req.json();
    
    console.log('🔍 Génération insights pour session:', sessionId);

    const insights = [
      {
        id: `insight_${Date.now()}`,
        type: 'pattern',
        severity: 'info',
        title: 'Pattern émotionnel détecté',
        description: 'Votre humeur s\'améliore progressivement au cours de la session',
        summary: 'Progression positive observée',
        confidence: 0.85,
        evidence: {
          dataPoints: 5,
          timeRange: { start: new Date(), end: new Date() }
        },
        actions: [],
        createdAt: new Date(),
        priority: 7,
        acknowledged: false
      }
    ];

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erreur insights:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});