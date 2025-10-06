// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { segmentId } = await req.json();
    
    if (!segmentId) {
      return new Response(
        JSON.stringify({ error: 'Missing segmentId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer le segment avec son storage_path
    const { data: segment, error } = await supabase
      .from('parcours_segments')
      .select('id, run_id, storage_path')
      .eq('id', segmentId)
      .single();

    if (error || !segment?.storage_path) {
      console.error('Segment not found or no storage_path:', error);
      return new Response(
        JSON.stringify({ error: 'Segment not found or no audio file' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Créer une URL signée (valide 1h)
    const { data: signedData, error: signError } = await supabase.storage
      .from('parcours-tracks')
      .createSignedUrl(segment.storage_path, 60 * 60); // 1 heure

    if (signError || !signedData) {
      console.error('Failed to sign URL:', signError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate signed URL' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ url: signedData.signedUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sign-track:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
