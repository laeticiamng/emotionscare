
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

    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const url = new URL(req.url);
    const since = url.searchParams.get('since') || '8 weeks';

    // Récupérer les entrées de journal depuis Supabase
    const { data: journalEntries, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    // Simuler des métriques hebdomadaires
    const weeklyMetrics = Array.from({ length: 8 }, (_, i) => {
      const weekStart = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
      const weekEntries = journalEntries?.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= weekStart && entryDate < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      }) || [];

      return {
        id: crypto.randomUUID(),
        user_id: user.id,
        week_start: weekStart.toISOString().split('T')[0],
        entries_count: weekEntries.length,
        total_words: weekEntries.reduce((sum, entry) => sum + (entry.content?.split(' ').length || 0), 0),
        avg_sentiment: Math.random() * 0.4 + 0.5, // 0.5-0.9
        reflection_score: Math.floor(Math.random() * 30) + 60, // 60-90
        consistency_score: weekEntries.length >= 3 ? 90 : weekEntries.length * 30,
        created_at: new Date().toISOString()
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: weeklyMetrics,
        user_id: user.id,
        period: since,
        summary: {
          total_entries: journalEntries?.length || 0,
          avg_weekly_entries: (journalEntries?.length || 0) / 8
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in journal-weekly-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
