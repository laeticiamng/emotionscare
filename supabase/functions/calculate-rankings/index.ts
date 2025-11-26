// @ts-nocheck
/**
 * calculate-rankings - Calcul des classements du leaderboard
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 5/min + CORS restrictif
 */
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

Deno.serve(async (req: Request) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  const { user, status } = await authorizeRole(req, ['admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'calculate-rankings',
    userId: user.id,
    limit: 5,
    windowMs: 60_000,
    description: 'Calculate rankings - Admin only',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`[calculate-rankings] ${timestamp} - Action: START`);

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`[calculate-rankings] ${timestamp} - Action: FETCH_ENTRIES`);

    // Fetch all leaderboard entries ordered by total_badges
    const { data: entries, error: fetchError } = await supabaseClient
      .from('user_leaderboard')
      .select('id, user_id, total_badges')
      .order('total_badges', { ascending: false })
      .order('last_updated', { ascending: true }); // Tiebreaker: earlier update wins

    if (fetchError) {
      console.error(`[calculate-rankings] ${timestamp} - Action: FETCH_ENTRIES - Error: ${fetchError.message}`);
      throw fetchError;
    }

    if (!entries || entries.length === 0) {
      const duration = Date.now() - startTime;
      console.log(`[calculate-rankings] ${timestamp} - Action: SKIP - Result: No entries - Duration: ${duration}ms`);
      return new Response(
        JSON.stringify({ message: 'No entries to rank' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log(`[calculate-rankings] ${timestamp} - Action: CALCULATE - Entries: ${entries.length}`);

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
    let errorCount = 0;

    console.log(`[calculate-rankings] ${timestamp} - Action: UPDATE_RANKS - Batches: ${Math.ceil(updates.length / batchSize)}`);

    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      
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
          errorCount++;
          console.error(`[calculate-rankings] ${timestamp} - Action: UPDATE_ENTRY - Error: ${updateError.message} - EntryID: ${update.id}`);
        } else {
          updatedCount++;
        }
      }

      console.log(`[calculate-rankings] ${timestamp} - Action: BATCH_COMPLETE - Batch: ${batchNum}/${Math.ceil(updates.length / batchSize)} - Updated: ${updatedCount}`);
    }

    const duration = Date.now() - startTime;
    console.log(`[calculate-rankings] ${timestamp} - Action: SUCCESS - Result: Updated ${updatedCount}/${entries.length} entries (${errorCount} errors) - Top10%: ${top10PercentCount} - Duration: ${duration}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        totalEntries: entries.length,
        updatedCount: updatedCount,
        errorCount: errorCount,
        top10PercentCount: top10PercentCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    const duration = Date.now() - startTime;
    const errorTimestamp = new Date().toISOString();
    console.error(`[calculate-rankings] ${errorTimestamp} - Action: ERROR - Error: ${error.message} - Duration: ${duration}ms - Stack: ${error.stack}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
