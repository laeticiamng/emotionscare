// @ts-nocheck
/**
 * Discovery API - Personalized content recommendations
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DISCOVERY_CATEGORIES = [
  'breathing',
  'meditation', 
  'music',
  'coaching',
  'vr',
  'games',
  'community',
  'journal',
];

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
      case 'recommendations': {
        // Get user's recent activity for personalization
        const { data: recentActivity } = await supabase
          .from('user_activities')
          .select('activity_data')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        // Count module usage
        const moduleUsage: Record<string, number> = {};
        (recentActivity || []).forEach(a => {
          const moduleName = (a.activity_data as Record<string, unknown>)?.module_name as string;
          if (moduleName) {
            moduleUsage[moduleName] = (moduleUsage[moduleName] || 0) + 1;
          }
        });

        // Get user's current mood
        const { data: latestMood } = await supabase
          .from('moods')
          .select('score, primary_emotion')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Build recommendations based on mood and usage
        const recommendations = [];
        const moodScore = latestMood?.score || 5;

        if (moodScore <= 3) {
          recommendations.push(
            { type: 'breathing', title: 'Respiration apaisante', priority: 1, reason: 'Pour calmer l\'anxiété' },
            { type: 'coach', title: 'Parler à Nyvee', priority: 2, reason: 'Support émotionnel' },
            { type: 'music', title: 'Musique relaxante', priority: 3, reason: 'Détente musicale' },
          );
        } else if (moodScore >= 7) {
          recommendations.push(
            { type: 'gamification', title: 'Défi du jour', priority: 1, reason: 'Maintenir votre élan positif' },
            { type: 'community', title: 'Partager votre énergie', priority: 2, reason: 'Inspirer les autres' },
            { type: 'journal', title: 'Capturer ce moment', priority: 3, reason: 'Journaling positif' },
          );
        } else {
          recommendations.push(
            { type: 'meditation', title: 'Méditation guidée', priority: 1, reason: 'Équilibre intérieur' },
            { type: 'activities', title: 'Activité découverte', priority: 2, reason: 'Explorer quelque chose de nouveau' },
            { type: 'vr', title: 'Expérience immersive', priority: 3, reason: 'Évasion mentale' },
          );
        }

        // Add unused categories
        const usedTypes = recommendations.map(r => r.type);
        const unusedCategories = DISCOVERY_CATEGORIES.filter(c => !usedTypes.includes(c) && !moduleUsage[c]);
        
        unusedCategories.slice(0, 2).forEach((cat, i) => {
          recommendations.push({
            type: cat,
            title: `Découvrir ${cat}`,
            priority: 4 + i,
            reason: 'Nouvelle fonctionnalité à explorer',
          });
        });

        console.log('[discovery-api] Generated recommendations for user:', user.id);
        return new Response(JSON.stringify({ 
          recommendations,
          currentMood: moodScore,
          modulesUsed: Object.keys(moduleUsage).length,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'trending': {
        // Get popular activities from the last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const { data: trendingActivities } = await supabase
          .from('activities')
          .select('id, title, category, popularity_score')
          .order('popularity_score', { ascending: false })
          .limit(10);

        const { data: upcomingSessions } = await supabase
          .from('group_sessions')
          .select('id, title, category, scheduled_at, host:host_id(display_name)')
          .eq('status', 'scheduled')
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(5);

        return new Response(JSON.stringify({ 
          trendingActivities: trendingActivities || [],
          upcomingSessions: upcomingSessions || [],
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'explore': {
        const { category } = body;

        const { data: activities } = await supabase
          .from('activities')
          .select('*')
          .eq('category', category)
          .order('popularity_score', { ascending: false })
          .limit(20);

        return new Response(JSON.stringify({ 
          activities: activities || [],
          category,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'search': {
        const { query, limit = 20 } = body;

        const { data: results } = await supabase
          .from('activities')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
          .limit(limit);

        return new Response(JSON.stringify({ 
          results: results || [],
          query,
        }), {
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
    console.error('[discovery-api] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
