// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROFILES = {
  joy: { prompt: "Uplifting bright energetic therapeutic music", tempo: 120, desc: "Musique joyeuse" },
  calm: { prompt: "Peaceful ambient soft relaxing music", tempo: 60, desc: "Musique apaisante" },
  sad: { prompt: "Melancholic comforting emotional music", tempo: 70, desc: "Musique réconfortante" },
  anger: { prompt: "Intense cathartic transformative music", tempo: 100, desc: "Musique cathartique" },
  anxious: { prompt: "Grounding calming reassuring music", tempo: 65, desc: "Musique rassurante" },
  energetic: { prompt: "Dynamic motivating powerful music", tempo: 130, desc: "Musique dynamique" },
  neutral: { prompt: "Balanced peaceful harmonious music", tempo: 90, desc: "Musique équilibrée" }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { action, emotion, customPrompt, sunoTaskId, trackId } = body;
    const sunoKey = Deno.env.get('SUNO_API_KEY');
    if (!sunoKey) throw new Error('SUNO_API_KEY not configured');

    // Analyser émotions
    if (action === 'analyze-emotions') {
      const { data: scans } = await supabaseClient
        .from('emotion_scans')
        .select('emotion_primary, emotion_intensity')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const freq: Record<string, number> = {};
      (scans || []).forEach(s => {
        const e = s.emotion_primary || 'neutral';
        freq[e] = (freq[e] || 0) + 1;
      });

      const dominant = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
      return new Response(JSON.stringify({
        dominantEmotion: dominant,
        emotionFrequency: freq,
        recommendation: PROFILES[dominant] || PROFILES.neutral
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Générer musique
    if (action === 'generate-music') {
      const profile = PROFILES[emotion] || PROFILES.neutral;
      const prompt = customPrompt || profile.prompt;

      const sunoRes = await fetch('https://api.suno.ai/v1/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sunoKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, make_instrumental: true, wait_audio: false })
      });

      if (!sunoRes.ok) throw new Error(`Suno API error: ${sunoRes.status}`);
      const sunoData = await sunoRes.json();

      const { data: track } = await supabaseClient
        .from('generated_music_tracks')
        .insert({
          user_id: user.id,
          emotion,
          prompt,
          original_task_id: sunoData.id,
          generation_status: 'pending',
          metadata: { profile }
        })
        .select()
        .single();

      const { data: session } = await supabaseClient
        .from('music_therapy_sessions')
        .insert({ user_id: user.id, emotion_before: emotion, track_id: track?.id })
        .select()
        .single();

      return new Response(JSON.stringify({
        success: true,
        taskId: sunoData.id,
        trackId: track?.id,
        sessionId: session?.id,
        emotion,
        profile,
        status: 'generating'
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Check status
    if (action === 'check-status') {
      const statusRes = await fetch(`https://api.suno.ai/v1/generate/${sunoTaskId}`, {
        headers: { 'Authorization': `Bearer ${sunoKey}` }
      });

      if (!statusRes.ok) throw new Error('Status check failed');
      const statusData = await statusRes.json();

      if (statusData.status === 'complete' && statusData.audio_url && trackId) {
        await supabaseClient
          .from('generated_music_tracks')
          .update({
            audio_url: statusData.audio_url,
            image_url: statusData.image_url,
            duration: statusData.duration,
            generation_status: 'complete'
          })
          .eq('id', trackId);
      }

      return new Response(JSON.stringify({
        success: true,
        status: statusData.status,
        audio_url: statusData.audio_url,
        image_url: statusData.image_url
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Recommendations
    if (action === 'get-recommendations') {
      const [prefs, tracks, sessions] = await Promise.all([
        supabaseClient.from('user_music_preferences').select('*').eq('user_id', user.id).single(),
        supabaseClient.from('generated_music_tracks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
        supabaseClient.from('music_therapy_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
      ]);

      return new Response(JSON.stringify({
        preferences: prefs.data,
        recentTracks: tracks.data || [],
        sessions: sessions.data || [],
        totalGenerated: tracks.data?.length || 0
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[emotion-music-ai]', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
