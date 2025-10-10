// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { action, entryData, entryId, startDate, endDate } = await req.json();

    switch (action) {
      case 'create': {
        const { data, error } = await supabase
          .from('journal_text_entries')
          .insert([{
            user_id: user.id,
            content: entryData.content,
            emotion_tags: entryData.emotions,
            intensity: entryData.intensity,
            gratitude_items: entryData.gratitude || [],
            context_tags: entryData.contextTags || []
          }])
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ 
          success: true, 
          entry: data,
          message: 'Entrée de journal créée avec succès' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get_entries': {
        let query = supabase
          .from('journal_text_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (startDate) {
          query = query.gte('created_at', startDate);
        }
        if (endDate) {
          query = query.lte('created_at', endDate);
        }

        const { data, error } = await query.limit(50);
        if (error) throw error;

        return new Response(JSON.stringify({ 
          success: true, 
          entries: data 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get_insights': {
        const { data: entries, error } = await supabase
          .from('journal_text_entries')
          .select('emotion_tags, intensity, created_at')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Analyse des patterns émotionnels
        const emotionCounts: Record<string, number> = {};
        let totalIntensity = 0;
        let entryCount = 0;

        entries.forEach((entry: any) => {
          if (entry.emotion_tags) {
            entry.emotion_tags.forEach((emotion: string) => {
              emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
            });
          }
          if (entry.intensity) {
            totalIntensity += entry.intensity;
            entryCount++;
          }
        });

        const avgIntensity = entryCount > 0 ? totalIntensity / entryCount : 0;
        const topEmotions = Object.entries(emotionCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([emotion, count]) => ({ emotion, count }));

        return new Response(JSON.stringify({
          success: true,
          insights: {
            totalEntries: entries.length,
            avgIntensity: Math.round(avgIntensity * 10) / 10,
            topEmotions,
            weeklyFrequency: Math.round((entries.length / 4) * 10) / 10
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'delete': {
        const { error } = await supabase
          .from('journal_text_entries')
          .delete()
          .eq('id', entryId)
          .eq('user_id', user.id);

        if (error) throw error;

        return new Response(JSON.stringify({ 
          success: true,
          message: 'Entrée supprimée avec succès' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Action non reconnue' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Erreur dans emotional-journal:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erreur serveur' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
