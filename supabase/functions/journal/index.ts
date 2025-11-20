import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Non authentifié');
    }

    const { action, payload } = await req.json();

    switch (action) {
      case 'save_voice_entry': {
        const { emotion, intensity, transcription, audio_url, tags } = payload;
        
        const { data, error } = await supabaseClient
          .from('journal_voice')
          .insert({
            user_id: user.id,
            emotion_type: emotion,
            intensity: intensity || 0.5,
            transcription,
            audio_url,
            tags: tags || [],
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'save_text_entry': {
        const { content, emotion, intensity, tags, mood_score } = payload;
        
        const { data, error } = await supabaseClient
          .from('journal_text')
          .insert({
            user_id: user.id,
            content,
            emotion_type: emotion,
            intensity: intensity || 0.5,
            tags: tags || [],
            mood_score: mood_score || 5,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_entries': {
        const { limit = 50, offset = 0, type = 'all' } = payload || {};
        
        let entries = [];

        if (type === 'voice' || type === 'all') {
          const { data: voiceData } = await supabaseClient
            .from('journal_voice')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);
          
          if (voiceData) {
            entries.push(...voiceData.map((e: any) => ({ ...e, type: 'voice' })));
          }
        }

        if (type === 'text' || type === 'all') {
          const { data: textData } = await supabaseClient
            .from('journal_text')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);
          
          if (textData) {
            entries.push(...textData.map((e: any) => ({ ...e, type: 'text' })));
          }
        }

        entries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return new Response(
          JSON.stringify({ ok: true, data: { entries: entries.slice(0, limit) } }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_insights': {
        const { days = 30 } = payload || {};
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data: voiceData } = await supabaseClient
          .from('journal_voice')
          .select('emotion_type, intensity, created_at')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString());

        const { data: textData } = await supabaseClient
          .from('journal_text')
          .select('emotion_type, intensity, mood_score, created_at')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString());

        const allEntries = [
          ...(voiceData || []).map((e: any) => ({ ...e, type: 'voice' })),
          ...(textData || []).map((e: any) => ({ ...e, type: 'text' }))
        ];

        const emotionCounts: Record<string, number> = allEntries.reduce((acc: any, entry: any) => {
          acc[entry.emotion_type] = (acc[entry.emotion_type] || 0) + 1;
          return acc;
        }, {});

        const avgIntensity = allEntries.length > 0
          ? allEntries.reduce((sum: number, e: any) => sum + (e.intensity || 0), 0) / allEntries.length
          : 0;

        const avgMood = textData && textData.length > 0
          ? textData.reduce((sum: number, e: any) => sum + (e.mood_score || 5), 0) / textData.length
          : 5;

        const insights = {
          total_entries: allEntries.length,
          dominant_emotion: Object.keys(emotionCounts).reduce((a, b) => 
            emotionCounts[a] > emotionCounts[b] ? a : b, 'neutral'),
          emotion_distribution: emotionCounts,
          avg_intensity: Math.round(avgIntensity * 100) / 100,
          avg_mood: Math.round(avgMood * 10) / 10,
          entries_by_day: allEntries.length / days,
          period_days: days
        };

        return new Response(
          JSON.stringify({ ok: true, data: insights }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete_entry': {
        const { entry_id, entry_type } = payload;
        
        const table = entry_type === 'voice' ? 'journal_voice' : 'journal_text';
        
        const { error } = await supabaseClient
          .from(table)
          .delete()
          .eq('id', entry_id)
          .eq('user_id', user.id);

        if (error) throw error;

        return new Response(
          JSON.stringify({ ok: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Action non supportée');
    }
  } catch (error) {
    console.error('Erreur journal:', error);
    const err = error as Error;
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
