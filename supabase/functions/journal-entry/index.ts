import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authenticateRequest } from '../_shared/auth-middleware.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: authResult.status, headers: corsHeaders }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { entry_id } = await req.json();

    if (!entry_id) {
      return new Response(
        JSON.stringify({ error: 'Entry ID required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get journal entry for the authenticated user
    const { data: entry, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', entry_id)
      .eq('user_id', authResult.user.id)
      .single();

    if (error || !entry) {
      return new Response(
        JSON.stringify({ error: 'Entry not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Format response
    const response = {
      entry_id: entry.id,
      created_at: entry.created_at,
      mode: entry.mode,
      mood_bucket: entry.mood_bucket,
      summary: entry.summary,
      suggestion: entry.suggestion,
      transcript_url: entry.transcript_url,
      media_url: entry.media_url,
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in journal-entry:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});