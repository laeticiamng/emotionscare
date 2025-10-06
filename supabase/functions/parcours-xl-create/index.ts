// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { presetKey, emotionState } = await req.json();
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('🎭 Création parcours XL:', presetKey, 'pour user:', user.id);

    // Charger le preset depuis les fichiers YAML (pour MVP, hardcodé)
    const presets: Record<string, any> = {
      'universel-reset': {
        title: 'Reset Universel → Équilibre',
        duration: 20,
        segments: [
          { title: 'Respiration guidée', start_s: 0, end_s: 120 },
          { title: 'Attention au présent', start_s: 120, end_s: 240 },
          { title: 'Défusion cognitive', start_s: 240, end_s: 360 },
          { title: 'Recadrage & Ancrage', start_s: 360, end_s: 600 },
          { title: 'Retour doux', start_s: 600, end_s: 720 },
        ],
        music: { bpm: 68, style: 'Calming 6/8, 68 BPM, dorian, felt piano + handpan' }
      },
      'panique-anxiete': {
        title: 'Panique → Calme',
        duration: 20,
        segments: [
          { title: 'Respiration 4/6', start_s: 0, end_s: 120 },
          { title: 'Ancrage 5-4-3-2-1', start_s: 120, end_s: 240 },
          { title: 'Exposition interoceptive', start_s: 240, end_s: 480 },
          { title: 'Restructuration', start_s: 480, end_s: 720 },
          { title: 'Consolidation', start_s: 720, end_s: 960 },
          { title: 'Sortie douce', start_s: 960, end_s: 1200 },
        ],
        music: { bpm: 64, style: 'A dorian 64 BPM, handpan lull, felt piano' }
      },
      'tristesse-deuil': {
        title: 'Tristesse → Lumière',
        duration: 22,
        segments: [
          { title: 'Accueil de la tristesse', start_s: 0, end_s: 120 },
          { title: 'Scan corporel', start_s: 120, end_s: 300 },
          { title: 'Activation comportementale', start_s: 300, end_s: 600 },
          { title: 'Recadrage socratique', start_s: 600, end_s: 900 },
          { title: 'Lumière progressive', start_s: 900, end_s: 1200 },
          { title: 'Sortie douce', start_s: 1200, end_s: 1320 },
        ],
        music: { bpm: 68, style: 'Cinematic piano & strings 68 BPM, lydian shimmer' }
      }
    };

    const preset = presets[presetKey];
    if (!preset) {
      throw new Error(`Preset inconnu: ${presetKey}`);
    }

    // Créer la run dans la DB
    const { data: run, error: runError } = await supabase
      .from('parcours_runs')
      .insert({
        user_id: user.id,
        preset_key: presetKey,
        status: 'generating',
        metadata: { emotion_state: emotionState }
      })
      .select()
      .single();

    if (runError) throw runError;

    console.log('✅ Run créée:', run.id);

    // Créer les segments (seront générés par une Edge Function séparée)
    const segmentsToInsert = preset.segments.map((seg: any, index: number) => ({
      run_id: run.id,
      segment_index: index,
      title: seg.title,
      start_seconds: seg.start_s,
      end_seconds: seg.end_s,
      voiceover_script: seg.voiceover || '',
      status: 'pending'
    }));

    const { error: segmentsError } = await supabase
      .from('parcours_segments')
      .insert(segmentsToInsert);

    if (segmentsError) throw segmentsError;

    // Déclencher la génération asynchrone (background task)
    // Pour MVP, on retourne juste le runId
    // La génération se fera via un autre appel ou en background

    return new Response(
      JSON.stringify({
        runId: run.id,
        title: preset.title,
        totalDuration: preset.duration * 60,
        segmentsCount: preset.segments.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
