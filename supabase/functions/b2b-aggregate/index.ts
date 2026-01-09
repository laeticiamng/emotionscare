// @ts-nocheck
/**
 * Edge function pour agréger les données B2B de manière anonymisée
 * Calcule les métriques hebdomadaires sans données individuelles
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MIN_ANONYMIZATION_THRESHOLD = 5;

interface AggregateResult {
  org_id: string;
  week_start: string;
  total_sessions: number;
  unique_users: number;
  avg_session_duration: number;
  pathway_distribution: Record<string, number>;
  usage_by_time_slot: Record<string, number>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { org_id, week_start } = await req.json();

    if (!org_id) {
      return new Response(
        JSON.stringify({ error: 'org_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate week boundaries
    const weekStartDate = week_start 
      ? new Date(week_start) 
      : getStartOfCurrentWeek();
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 7);

    // Fetch anonymous sessions for this org and week
    const { data: sessions, error: sessionsError } = await supabase
      .from('b2b_anonymous_sessions')
      .select('*')
      .eq('org_id', org_id)
      .gte('started_at', weekStartDate.toISOString())
      .lt('started_at', weekEndDate.toISOString());

    if (sessionsError) {
      throw sessionsError;
    }

    // Check anonymization threshold
    const uniqueSessionHashes = new Set(sessions?.map(s => s.session_hash) || []);
    
    if (uniqueSessionHashes.size < MIN_ANONYMIZATION_THRESHOLD) {
      // Not enough data for anonymized aggregation
      return new Response(
        JSON.stringify({ 
          message: 'Insufficient data for anonymized aggregation',
          threshold: MIN_ANONYMIZATION_THRESHOLD,
          current: uniqueSessionHashes.size
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate aggregates
    const totalSessions = sessions?.length || 0;
    const uniqueUsers = uniqueSessionHashes.size;
    
    // Average session duration
    const totalDuration = sessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0;
    const avgSessionDuration = totalSessions > 0 
      ? Math.round(totalDuration / totalSessions / 60) 
      : 0;

    // Pathway distribution
    const pathwayCounts: Record<string, number> = {};
    sessions?.forEach(s => {
      const type = s.session_type || 'unknown';
      pathwayCounts[type] = (pathwayCounts[type] || 0) + 1;
    });

    // Usage by time slot
    const timeSlotCounts: Record<string, number> = {
      morning: 0,   // 6-12
      noon: 0,      // 12-14
      afternoon: 0, // 14-18
      evening: 0,   // 18-22
    };

    sessions?.forEach(s => {
      const hour = new Date(s.started_at).getHours();
      if (hour >= 6 && hour < 12) timeSlotCounts.morning++;
      else if (hour >= 12 && hour < 14) timeSlotCounts.noon++;
      else if (hour >= 14 && hour < 18) timeSlotCounts.afternoon++;
      else if (hour >= 18 && hour < 22) timeSlotCounts.evening++;
    });

    // Convert to percentages
    Object.keys(timeSlotCounts).forEach(key => {
      timeSlotCounts[key] = totalSessions > 0 
        ? Math.round((timeSlotCounts[key] / totalSessions) * 100) 
        : 0;
    });

    // Upsert weekly aggregate
    const aggregateData: AggregateResult = {
      org_id,
      week_start: weekStartDate.toISOString().split('T')[0],
      total_sessions: totalSessions,
      unique_users: uniqueUsers,
      avg_session_duration: avgSessionDuration,
      pathway_distribution: pathwayCounts,
      usage_by_time_slot: timeSlotCounts,
    };

    const { error: upsertError } = await supabase
      .from('org_weekly_aggregates')
      .upsert(aggregateData, {
        onConflict: 'org_id,week_start',
      });

    if (upsertError) {
      throw upsertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        aggregate: aggregateData,
        anonymization: {
          threshold: MIN_ANONYMIZATION_THRESHOLD,
          uniqueUsers: uniqueUsers,
          isAnonymized: true
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Aggregation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getStartOfCurrentWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}
