// @ts-nocheck
/**
 * Context Lens Emotions Edge Function
 * Gestion de l'historique émotionnel et émotions en temps réel
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
      case 'current': {
        // Récupérer les émotions les plus récentes
        const { data: recentEmotions } = await supabase
          .from('emotion_scores')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (recentEmotions && recentEmotions.length > 0) {
          const latest = recentEmotions[0];
          return new Response(
            JSON.stringify({
              emotions: {
                anxiety: latest.anxiety || 0,
                joy: latest.joy || 0,
                sadness: latest.sadness || 0,
                anger: latest.anger || 0,
                disgust: latest.disgust || 0,
                surprise: latest.surprise || 0,
                timestamp: latest.created_at,
              },
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Données simulées si aucune donnée
        return new Response(
          JSON.stringify({
            emotions: {
              anxiety: 0.25 + Math.random() * 0.2,
              joy: 0.45 + Math.random() * 0.25,
              sadness: 0.1 + Math.random() * 0.15,
              anger: 0.05 + Math.random() * 0.1,
              disgust: 0.02 + Math.random() * 0.05,
              surprise: 0.08 + Math.random() * 0.1,
              timestamp: new Date().toISOString(),
            },
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'history': {
        const { from, to, interval = 'day' } = params;

        const { data: emotionData, error } = await supabase
          .from('emotion_scores')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', from)
          .lte('created_at', to)
          .order('created_at', { ascending: true });

        if (error) {
          console.log('[Context Lens Emotions] Using mock history:', error.message);
          return new Response(
            JSON.stringify({ history: generateMockHistory(user.id, from, to, interval) }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Agréger par intervalle
        const aggregated = aggregateByInterval(emotionData || [], interval);

        return new Response(
          JSON.stringify({
            history: {
              data: aggregated,
              interval,
              patient_id: user.id,
            },
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'record': {
        // Enregistrer une nouvelle mesure émotionnelle
        const { emotions } = params;

        const { data, error } = await supabase
          .from('emotion_scores')
          .insert({
            user_id: user.id,
            ...emotions,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error('[Context Lens] Failed to record emotions:', error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data }),
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
    console.error('[Context Lens Emotions] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function aggregateByInterval(data: any[], interval: string) {
  if (data.length === 0) return [];

  const groups: Record<string, any[]> = {};

  data.forEach((entry) => {
    const date = new Date(entry.created_at);
    let key: string;

    switch (interval) {
      case 'hour':
        key = `${date.toISOString().slice(0, 13)}:00:00`;
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().slice(0, 10);
        break;
      default: // day
        key = date.toISOString().slice(0, 10);
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  });

  return Object.entries(groups).map(([timestamp, entries]) => {
    const avg = {
      anxiety: 0,
      joy: 0,
      sadness: 0,
      anger: 0,
      disgust: 0,
      surprise: 0,
    };

    entries.forEach((e) => {
      avg.anxiety += e.anxiety || 0;
      avg.joy += e.joy || 0;
      avg.sadness += e.sadness || 0;
      avg.anger += e.anger || 0;
      avg.disgust += e.disgust || 0;
      avg.surprise += e.surprise || 0;
    });

    const count = entries.length;
    Object.keys(avg).forEach((k) => {
      avg[k as keyof typeof avg] /= count;
    });

    return {
      timestamp,
      emotions: avg,
    };
  });
}

function generateMockHistory(userId: string, from: string, to: string, interval: string) {
  const data = [];
  const startDate = new Date(from);
  const endDate = new Date(to);
  let current = new Date(startDate);

  const intervalMs = interval === 'hour' ? 3600000 : interval === 'week' ? 604800000 : 86400000;

  while (current <= endDate) {
    data.push({
      timestamp: current.toISOString(),
      emotions: {
        anxiety: 0.2 + Math.random() * 0.4,
        joy: 0.3 + Math.random() * 0.4,
        sadness: 0.1 + Math.random() * 0.25,
        anger: 0.05 + Math.random() * 0.15,
        disgust: 0.02 + Math.random() * 0.08,
        surprise: 0.05 + Math.random() * 0.15,
      },
    });
    current = new Date(current.getTime() + intervalMs);
  }

  return {
    data,
    interval,
    patient_id: userId,
  };
}
