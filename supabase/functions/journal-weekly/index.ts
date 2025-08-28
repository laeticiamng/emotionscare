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

    const { from, to, q } = await req.json();

    // Build query
    let query = supabase
      .from('journal_entries')
      .select(`
        id,
        created_at,
        mode,
        mood_bucket,
        summary,
        suggestion,
        transcript_url,
        media_url
      `)
      .eq('user_id', authResult.user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(50);

    // Add date filters if provided
    if (from) {
      query = query.gte('created_at', from);
    }
    if (to) {
      query = query.lte('created_at', to);
    }

    const { data: entries, error } = await query;

    if (error) {
      throw error;
    }

    // Filter by search query if provided (client-side for now)
    let filteredEntries = entries || [];
    if (q && q.trim()) {
      const searchTerm = q.toLowerCase();
      filteredEntries = filteredEntries.filter(entry =>
        entry.summary?.toLowerCase().includes(searchTerm) ||
        entry.suggestion?.toLowerCase().includes(searchTerm)
      );
    }

    // Format entries for frontend
    const formattedEntries = filteredEntries.map(entry => ({
      entry_id: entry.id,
      created_at: entry.created_at,
      mode: entry.mode,
      mood_bucket: entry.mood_bucket,
      summary: entry.summary,
      suggestion: entry.suggestion,
      transcript_url: entry.transcript_url,
      media_url: entry.media_url,
    }));

    return new Response(
      JSON.stringify({ entries: formattedEntries }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in journal-weekly:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});