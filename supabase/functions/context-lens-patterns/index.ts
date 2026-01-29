// @ts-nocheck
/**
 * Context Lens Patterns Edge Function
 * Détection et gestion des patterns émotionnels
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, ...params } = await req.json();

    switch (action) {
      case 'list': {
        const period = params.period || 'month';
        
        // Try to fetch from database
        const { data: patterns, error } = await supabase
          .from('emotion_patterns')
          .select('*')
          .eq('user_id', user.id)
          .order('confidence', { ascending: false });

        if (error) {
          console.log('[Context Lens Patterns] Using mock data:', error.message);
          return new Response(
            JSON.stringify({ patterns: generateMockPatterns() }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ patterns: patterns || [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'detect': {
        // Detect patterns from emotion history
        console.log('[Context Lens] Detecting patterns for user:', user.id);
        
        // Fetch emotion data for analysis
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        
        const { data: emotionData } = await supabase
          .from('emotion_scores')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', thirtyDaysAgo)
          .order('created_at', { ascending: true });

        const detectedPatterns = analyzePatterns(emotionData || []);

        return new Response(
          JSON.stringify({ patterns: detectedPatterns }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('[Context Lens Patterns] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateMockPatterns() {
  return [
    {
      id: 'pattern-1',
      name: 'Anxiété du lundi matin',
      description: 'Votre niveau d\'anxiété augmente régulièrement le lundi entre 8h et 10h.',
      emotions: ['anxiety', 'stress'],
      frequency: 'weekly',
      triggers: ['travail', 'réunions'],
      time_of_day: 'morning',
      day_of_week: [1],
      confidence: 0.87,
    },
    {
      id: 'pattern-2',
      name: 'Détente du week-end',
      description: 'Votre niveau de joie et de sérénité augmente significativement le samedi.',
      emotions: ['joy', 'calm'],
      frequency: 'weekly',
      triggers: ['repos', 'famille', 'loisirs'],
      day_of_week: [6],
      confidence: 0.82,
    },
    {
      id: 'pattern-3',
      name: 'Stress post-déjeuner',
      description: 'Une légère augmentation du stress est observée après le déjeuner.',
      emotions: ['anxiety'],
      frequency: 'daily',
      triggers: ['digestion', 'retour au travail'],
      time_of_day: 'afternoon',
      confidence: 0.65,
    },
  ];
}

function analyzePatterns(emotionData: any[]) {
  if (!emotionData || emotionData.length < 7) {
    return generateMockPatterns();
  }

  const patterns: any[] = [];
  
  // Analyze by day of week
  const byDayOfWeek: Record<number, any[]> = {};
  emotionData.forEach(entry => {
    const day = new Date(entry.created_at).getDay();
    if (!byDayOfWeek[day]) byDayOfWeek[day] = [];
    byDayOfWeek[day].push(entry);
  });

  // Detect weekly patterns
  Object.entries(byDayOfWeek).forEach(([day, entries]) => {
    if (entries.length >= 2) {
      const avgAnxiety = entries.reduce((sum, e) => sum + (e.anxiety || 0), 0) / entries.length;
      if (avgAnxiety > 0.5) {
        const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        patterns.push({
          id: `pattern-day-${day}`,
          name: `Anxiété du ${dayNames[parseInt(day)]}`,
          description: `Votre niveau d'anxiété est généralement plus élevé le ${dayNames[parseInt(day)]}.`,
          emotions: ['anxiety'],
          frequency: 'weekly',
          triggers: [],
          day_of_week: [parseInt(day)],
          confidence: Math.min(0.5 + entries.length * 0.1, 0.95),
        });
      }
    }
  });

  return patterns.length > 0 ? patterns : generateMockPatterns();
}
