import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MicroBreakMetrics {
  module: 'screen-silk' | 'other';
  action: 'start' | 'end';
  duration_s?: number;
  label?: 'gain' | 'léger' | 'incertain';
  blink_count?: number;
  user_agent?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const body: MicroBreakMetrics = await req.json();
    
    // Validation des données
    if (!body.module || !body.action) {
      return new Response(
        JSON.stringify({ error: 'Module et action requis' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log des métriques (à remplacer par une vraie base de données)
    console.log('📊 Métriques micro-pause reçues:', {
      module: body.module,
      action: body.action,
      duration: body.duration_s || 0,
      label: body.label || 'unknown',
      blinkCount: body.blink_count || 0,
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get('user-agent')?.slice(0, 100) || 'unknown'
    });

    // Simulation d'enregistrement réussi
    const response = {
      success: true,
      module: body.module,
      action: body.action,
      timestamp: new Date().toISOString(),
      message: `Métriques ${body.module} enregistrées avec succès`
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Erreur dans micro-breaks-metrics:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Erreur interne du serveur', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});