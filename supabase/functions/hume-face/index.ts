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
    const { image, type = 'base64' } = await req.json();
    const humeApiKey = Deno.env.get('HUME_API_KEY');
    
    if (!humeApiKey) {
      throw new Error('HUME_API_KEY not configured');
    }

    // Analyze face emotions
    const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
      method: 'POST',
      headers: {
        'X-Hume-Api-Key': humeApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        models: {
          face: {}
        },
        urls: type === 'url' ? [image] : undefined,
        files: type === 'base64' ? [{ 
          name: 'face.jpg',
          data: image 
        }] : undefined
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hume API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    return new Response(JSON.stringify({ 
      success: true,
      jobId: result.job_id,
      message: 'Face analysis started'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in hume-face function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      fallback: {
        emotions: ['neutral', 'calm', 'focused'],
        confidence: 0.5
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});