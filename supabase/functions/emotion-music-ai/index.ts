// @ts-nocheck
/**
 * EMOTION MUSIC AI - EmotionsCare
 * Génération de musique thérapeutique basée sur l'analyse émotionnelle
 * Connecté à Suno AI pour génération unique
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapping émotions → paramètres musicaux Suno
const EMOTION_MUSIC_PROFILES = {
  joy: {
    prompt: "Uplifting melodic music with bright harmonies and energetic rhythm, therapeutic and joyful",
    tempo: 120,
    tags: ["upbeat", "happy", "energetic", "major key"],
    description: "Musique joyeuse et énergisante pour célébrer les émotions positives"
  },
  calm: {
    prompt: "Peaceful ambient music with soft pads, gentle melodies, and slow tempo, deeply relaxing",
    tempo: 60,
    tags: ["calm", "peaceful", "ambient", "relaxing"],
    description: "Musique apaisante pour la détente et la méditation"
  },
  sad: {
    prompt: "Melancholic but comforting music with minor harmonies, soft piano, and emotional depth",
    tempo: 70,
    tags: ["melancholic", "emotional", "comforting", "minor key"],
    description: "Musique réconfortante pour accompagner les moments difficiles"
  },
  anger: {
    prompt: "Intense yet therapeutic music that channels energy positively, with powerful rhythms gradually softening",
    tempo: 100,
    tags: ["intense", "cathartic", "transformative"],
    description: "Musique cathartique pour transformer la colère en énergie positive"
  },
  anxious: {
    prompt: "Grounding music with steady rhythms, soothing harmonies, and calming progressions to reduce anxiety",
    tempo: 65,
    tags: ["grounding", "calming", "stable", "reassuring"],
    description: "Musique rassurante pour apaiser l'anxiété"
  },
  energetic: {
    prompt: "Dynamic and motivating music with driving beats, uplifting melodies, and positive energy",
    tempo: 130,
    tags: ["energetic", "motivating", "powerful", "upbeat"],
    description: "Musique dynamique pour booster l'énergie et la motivation"
  },
  neutral: {
    prompt: "Balanced therapeutic music with moderate tempo, harmonious progressions, and peaceful atmosphere",
    tempo: 90,
    tags: ["balanced", "neutral", "peaceful", "harmonious"],
    description: "Musique équilibrée pour un état émotionnel stable"
  }
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

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, emotion, customPrompt, scanId } = await req.json();
    const sunoApiKey = Deno.env.get('SUNO_API_KEY');
    
    if (!sunoApiKey) {
      throw new Error('SUNO_API_KEY not configured');
    }

    // ACTION 1: Analyser les émotions récentes de l'utilisateur
    if (action === 'analyze-emotions') {
      const { data: recentScans, error: scanError } = await supabaseClient
        .from('emotion_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (scanError) throw scanError;

      // Analyser les tendances émotionnelles
      const emotionFrequency: Record<string, number> = {};
      const emotionIntensity: Record<string, number[]> = {};

      recentScans?.forEach(scan => {
        if (scan.emotions && typeof scan.emotions === 'object') {
          Object.entries(scan.emotions as Record<string, number>).forEach(([emotion, score]) => {
            emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1;
            if (!emotionIntensity[emotion]) emotionIntensity[emotion] = [];
            emotionIntensity[emotion].push(score as number);
          });
        }
      });

      // Émotion dominante
      const dominantEmotion = Object.entries(emotionFrequency)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral';

      // Intensité moyenne de l'émotion dominante
      const avgIntensity = emotionIntensity[dominantEmotion]
        ? emotionIntensity[dominantEmotion].reduce((a, b) => a + b, 0) / emotionIntensity[dominantEmotion].length
        : 0.5;

      return new Response(JSON.stringify({
        dominantEmotion,
        avgIntensity,
        emotionFrequency,
        recentScans: recentScans?.length || 0,
        musicProfile: EMOTION_MUSIC_PROFILES[dominantEmotion as keyof typeof EMOTION_MUSIC_PROFILES] || EMOTION_MUSIC_PROFILES.neutral
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ACTION 2: Générer musique personnalisée via Suno
    if (action === 'generate-music') {
      const profile = EMOTION_MUSIC_PROFILES[emotion as keyof typeof EMOTION_MUSIC_PROFILES] || EMOTION_MUSIC_PROFILES.neutral;
      const finalPrompt = customPrompt || profile.prompt;

      console.log('🎵 Generating music for emotion:', emotion, 'with prompt:', finalPrompt);

      // Appel à Suno API pour génération
      const generateResponse = await fetch('https://api.suno.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sunoApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          make_instrumental: true,
          model_version: 'v3.5',
          wait_audio: false,
          tags: profile.tags.join(', ')
        })
      });

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        console.error('Suno API error:', generateResponse.status, errorText);
        throw new Error(`Suno API error: ${generateResponse.status}`);
      }

      const sunoResult = await generateResponse.json();
      console.log('✅ Suno generation started:', sunoResult);

      // Enregistrer dans generated_music_tracks
      const { data: trackRecord, error: insertError } = await supabaseClient
        .from('generated_music_tracks')
        .insert({
          user_id: user.id,
          emotion,
          prompt: finalPrompt,
          original_task_id: sunoResult.id || sunoResult.task_id,
          generation_status: 'pending',
          metadata: {
            suno_response: sunoResult,
            profile,
            scan_id: scanId
          }
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Créer une session thérapeutique
      const { data: session, error: sessionError } = await supabaseClient
        .from('music_therapy_sessions')
        .insert({
          user_id: user.id,
          emotion_before: emotion,
          track_id: trackRecord.id
        })
        .select()
        .single();

      if (sessionError) console.error('Session creation error:', sessionError);

      return new Response(JSON.stringify({
        success: true,
        taskId: sunoResult.id || sunoResult.task_id,
        trackId: trackRecord.id,
        sessionId: session?.id,
        emotion,
        profile,
        status: 'generating'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ACTION 3: Vérifier le statut de génération
    if (action === 'check-status') {
      const { taskId, trackId } = await req.json();

      const statusResponse = await fetch(`https://api.suno.ai/v1/generate/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${sunoApiKey}`,
        }
      });

      if (!statusResponse.ok) {
        throw new Error(`Suno status check failed: ${statusResponse.status}`);
      }

      const statusResult = await statusResponse.json();
      console.log('📊 Generation status:', statusResult);

      // Mettre à jour le track si terminé
      if (statusResult.status === 'complete' && statusResult.audio_url) {
        const { error: updateError } = await supabaseClient
          .from('generated_music_tracks')
          .update({
            audio_url: statusResult.audio_url,
            image_url: statusResult.image_url,
            duration: statusResult.duration,
            generation_status: 'complete',
            metadata: { suno_response: statusResult }
          })
          .eq('id', trackId);

        if (updateError) console.error('Track update error:', updateError);

        // Mettre à jour les préférences utilisateur
        const { error: prefError } = await supabaseClient
          .from('user_music_preferences')
          .upsert({
            user_id: user.id,
            last_played_emotion: statusResult.metadata?.emotion,
            total_plays: 1
          }, {
            onConflict: 'user_id',
            ignoreDuplicates: false
          });

        if (prefError) console.error('Preferences update error:', prefError);
      }

      return new Response(JSON.stringify({
        success: true,
        status: statusResult.status,
        audio_url: statusResult.audio_url,
        image_url: statusResult.image_url,
        duration: statusResult.duration,
        metadata: statusResult
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ACTION 4: Récupérer recommandations personnalisées
    if (action === 'get-recommendations') {
      const { data: preferences } = await supabaseClient
        .from('user_music_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: recentTracks } = await supabaseClient
        .from('generated_music_tracks')
        .select('*')
        .eq('user_id', user.id)
        .eq('generation_status', 'complete')
        .order('created_at', { ascending: false })
        .limit(20);

      const { data: sessions } = await supabaseClient
        .from('music_therapy_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      return new Response(JSON.stringify({
        preferences,
        recentTracks,
        sessions,
        totalGenerated: recentTracks?.length || 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unknown action: ${action}`);

  } catch (error) {
    console.error('Error in emotion-music-ai function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      fallback: {
        message: 'Génération de musique temporairement indisponible',
        useLocal: true
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
