// @ts-nocheck
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
    const { audioId, continueAt, model, callBackUrl } = await req.json();
    
    const SUNO_API_KEY = Deno.env.get('SUNO_API_KEY');
    const SUNO_API_BASE = Deno.env.get('SUNO_API_BASE') || 'https://api.sunoapi.org';
    
    if (!SUNO_API_KEY) {
      throw new Error('SUNO_API_KEY not configured');
    }

    console.log('🎵 Extending Suno track:', audioId);

    const response = await fetch(`${SUNO_API_BASE}/suno-api/extend-music`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioId,
        continueAt: continueAt || 120,
        model: model || 'V4_5',
        callBackUrl: callBackUrl || ''
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Suno API error:', errorText);
      throw new Error(`Suno API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Extension started, taskId:', data.data?.taskId);

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error extending music:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
