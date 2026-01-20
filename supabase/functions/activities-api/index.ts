// @ts-nocheck
/**
 * Activities API - Backend for activity management and tracking
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'list': {
        const { category, difficulty, maxDuration, search } = body;
        let query = supabase
          .from('activities')
          .select('*')
          .order('popularity_score', { ascending: false });

        if (category) query = query.eq('category', category);
        if (difficulty) query = query.eq('difficulty', difficulty);
        if (maxDuration) query = query.lte('duration_minutes', maxDuration);
        if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

        const { data, error } = await query;
        if (error) throw error;

        return new Response(JSON.stringify({ activities: data || [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get': {
        const { activityId } = body;
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('id', activityId)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ activity: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'log': {
        const { activityType, moduleName, durationSeconds, metadata } = body;
        const { error } = await supabase
          .from('user_activities')
          .insert({
            user_id: user.id,
            activity_type: activityType,
            duration_seconds: durationSeconds,
            activity_data: { module_name: moduleName, ...metadata }
          });

        if (error) throw error;

        console.log('[activities-api] Activity logged:', activityType, moduleName);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'complete': {
        const { activityId, rating, notes, moodBefore, moodAfter } = body;
        const { data, error } = await supabase
          .from('user_activities')
          .insert({
            user_id: user.id,
            activity_id: activityId,
            rating,
            notes,
            mood_before: moodBefore,
            mood_after: moodAfter,
          })
          .select()
          .single();

        if (error) throw error;

        // Update activity popularity
        await supabase.rpc('increment_activity_popularity', { activity_id: activityId });

        console.log('[activities-api] Activity completed:', activityId);
        return new Response(JSON.stringify({ userActivity: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'favorites': {
        const { data, error } = await supabase
          .from('user_favorite_activities')
          .select('activity_id')
          .eq('user_id', user.id);

        if (error) throw error;

        return new Response(JSON.stringify({ 
          favorites: (data || []).map(r => r.activity_id) 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'addFavorite': {
        const { activityId } = body;
        const { error } = await supabase
          .from('user_favorite_activities')
          .upsert({ user_id: user.id, activity_id: activityId });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'removeFavorite': {
        const { activityId } = body;
        const { error } = await supabase
          .from('user_favorite_activities')
          .delete()
          .eq('user_id', user.id)
          .eq('activity_id', activityId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'stats': {
        const { days = 30 } = body;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString());

        if (error) throw error;

        const moduleUsage: Record<string, number> = {};
        const activityByDay: Record<string, number> = {};
        let totalDuration = 0;

        (data || []).forEach(activity => {
          const moduleName = (activity.activity_data as Record<string, unknown>)?.module_name as string || 'unknown';
          moduleUsage[moduleName] = (moduleUsage[moduleName] || 0) + 1;

          const day = activity.created_at.split('T')[0];
          activityByDay[day] = (activityByDay[day] || 0) + 1;

          totalDuration += activity.duration_seconds || 0;
        });

        return new Response(JSON.stringify({
          stats: {
            totalActivities: data?.length || 0,
            totalMinutes: Math.round(totalDuration / 60),
            moduleUsage,
            activityByDay,
            averageSessionDuration: data?.length > 0 ? Math.round(totalDuration / data.length / 60) : 0
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'history': {
        const { limit = 50 } = body;
        const { data, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        return new Response(JSON.stringify({ history: data || [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('[activities-api] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
