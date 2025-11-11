// @ts-nocheck
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting leaderboard ranking calculation');

    // Fetch all leaderboard entries ordered by total_badges
    const { data: entries, error: fetchError } = await supabaseClient
      .from('user_leaderboard')
      .select('id, user_id, total_badges')
      .order('total_badges', { ascending: false })
      .order('last_updated', { ascending: true }); // Tiebreaker: earlier update wins

    if (fetchError) {
      throw fetchError;
    }

    if (!entries || entries.length === 0) {
      console.log('No leaderboard entries found');
      return new Response(
        JSON.stringify({ message: 'No entries to rank' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log(`Found ${entries.length} entries to rank`);

    // Calculate ranks
    const totalEntries = entries.length;
    const top10PercentCount = Math.ceil(totalEntries * 0.1);

    const updates = entries.map((entry, index) => {
      const rank = index + 1;
      const isTop10Percent = rank <= top10PercentCount;

      return {
        id: entry.id,
        rank: rank,
        monthly_badge: isTop10Percent,
        last_updated: new Date().toISOString()
      };
    });

    // Update ranks in batches
    const batchSize = 100;
    let updatedCount = 0;

    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      
      for (const update of batch) {
        const { error: updateError } = await supabaseClient
          .from('user_leaderboard')
          .update({
            rank: update.rank,
            monthly_badge: update.monthly_badge,
            last_updated: update.last_updated
          })
          .eq('id', update.id);

        if (updateError) {
          console.error(`Error updating entry ${update.id}:`, updateError);
        } else {
          updatedCount++;
        }
      }

      console.log(`Updated batch ${Math.floor(i / batchSize) + 1}`);
    }

    console.log(`Successfully updated ${updatedCount} entries`);

    return new Response(
      JSON.stringify({
        success: true,
        totalEntries: entries.length,
        updatedCount: updatedCount,
        top10PercentCount: top10PercentCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error calculating rankings:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
