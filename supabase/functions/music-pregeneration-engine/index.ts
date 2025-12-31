// @ts-nocheck
/**
 * Music Pre-generation Engine
 * Anticipe et pré-génère la musique basée sur les patterns émotionnels utilisateur
 * pour éliminer toute latence lors de l'arrivée sur les expériences musicales
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

// Configuration des parcours émotionnels
const EMOTION_PARCOURS_CONFIG: Record<string, {
  style: string;
  model: string;
  instrumental: boolean;
  bpmRange: [number, number];
  mode: string;
  prompt: string;
}> = {
  stress: {
    style: 'lofi swing Rhodes vinyl hiss dorian',
    model: 'V4_5',
    instrumental: true,
    bpmRange: [65, 75],
    mode: 'dorian',
    prompt: 'Warm lofi 70 BPM, dorian mode, Rhodes piano with subtle vinyl crackle, soft and calming for stress relief'
  },
  burnout: {
    style: 'ambient piano pianosphere analog pads',
    model: 'V4_5',
    instrumental: true,
    bpmRange: [58, 65],
    mode: 'dorian',
    prompt: 'Ambient piano 62 BPM, soft analog pads, permission to rest, gentle healing energy'
  },
  motivation: {
    style: 'afro-house soft shakers organic percussions',
    model: 'V4_5',
    instrumental: true,
    bpmRange: [104, 110],
    mode: 'dorian/ionian',
    prompt: 'Organic house soft 108 BPM, gentle shakers and percussions, uplifting motivation'
  },
  concentration: {
    style: 'lofi focus instrumental patterns no vocals',
    model: 'V4_5',
    instrumental: true,
    bpmRange: [85, 95],
    mode: 'lofi',
    prompt: 'Lofi focus 90 BPM, instrumental only, repetitive patterns, no vocals, deep concentration'
  },
  nostalgie: {
    style: 'retro dream-pop chorus tape feel vi-IV-I-V',
    model: 'V4_5',
    instrumental: false,
    bpmRange: [68, 72],
    mode: 'ionian',
    prompt: 'Retro dream-pop 70 BPM, tape saturation, nostalgic melodies, warm and tender'
  },
  hypersensibilite: {
    style: 'ambient minimal textures no cymbals',
    model: 'V4_5',
    instrumental: true,
    bpmRange: [58, 62],
    mode: 'aeolian',
    prompt: 'Low-transient ambient 60 BPM, no cymbals, soft filtered textures, sensory protection'
  },
  peur: {
    style: 'handpan drones aeolian dorian 6/8',
    model: 'V4_5',
    instrumental: true,
    bpmRange: [60, 64],
    mode: 'aeolian',
    prompt: 'Handpan 6/8 62 BPM, aeolian to dorian progression, grounding and safe'
  },
  colere: {
    style: 'blues transition minor-blues pads guitar',
    model: 'V4_5',
    instrumental: true,
    bpmRange: [72, 88],
    mode: 'minor-blues',
    prompt: 'Minor-blues 80 BPM transitioning to airy pads, release and assertiveness'
  },
  apathie: {
    style: 'indie-house pop claps arps gentle energy',
    model: 'V4_5',
    instrumental: true,
    bpmRange: [96, 104],
    mode: 'ionian',
    prompt: 'Light indie-house 100 BPM, clean claps, soft arps, gentle awakening energy'
  },
  douleur: {
    style: 'warm drone low flute dorian acceptance',
    model: 'V4_5',
    instrumental: true,
    bpmRange: [60, 64],
    mode: 'dorian',
    prompt: 'Warm drone 62 BPM, low flute, dorian mode, pain acceptance and softening'
  },
  perfectionnisme: {
    style: 'neo-soul laid-back Rhodes nylon guitar',
    model: 'V4_5',
    instrumental: true,
    bpmRange: [72, 78],
    mode: 'mixolydian',
    prompt: 'Neo-soul 76 BPM, Rhodes and nylon guitar, flexibility and letting go'
  },
  calm: {
    style: 'lofi neo-soul Rhodes guitar palm-mute field recordings',
    model: 'V4_5',
    instrumental: true,
    bpmRange: [65, 75],
    mode: 'major',
    prompt: 'Lofi neo-soul 70 BPM, Rhodes piano, palm-mute guitar, distant ocean field recordings'
  },
  neutral: {
    style: 'ambient soft pads reverb warm',
    model: 'V4_5',
    instrumental: true,
    bpmRange: [70, 80],
    mode: 'ionian',
    prompt: 'Ambient 75 BPM, soft warm pads, ample reverb, balanced and neutral energy'
  }
};

// Suno API base
const SUNO_API_BASE = 'https://api.sunoapi.org';

interface PreGenerationRequest {
  action: 'analyze' | 'pregenerate' | 'status' | 'get-cached' | 'cleanup';
  userId?: string;
  emotions?: string[];
  parcours?: string;
  forceRegenerate?: boolean;
}

interface EmotionPattern {
  emotion: string;
  frequency: number;
  avgIntensity: number;
  timeSlots: string[];
  lastSeen: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    const body = await req.json() as PreGenerationRequest;
    const { action, userId, emotions, parcours, forceRegenerate } = body;

    console.log(`[pregeneration] Action: ${action}, userId: ${userId}`);

    switch (action) {
      case 'analyze': {
        // Analyser les patterns émotionnels de l'utilisateur
        if (!userId) {
          throw new Error('userId required for analyze action');
        }

        const patterns = await analyzeUserEmotionPatterns(supabase, userId);
        const predictions = predictNextEmotions(patterns);
        
        // Déclencher la pré-génération pour les émotions prédites
        const pregenerationTasks = await triggerPregeneration(
          supabase, 
          userId, 
          predictions.map(p => p.emotion),
          SUNO_API_BASE
        );

        return new Response(JSON.stringify({
          success: true,
          patterns,
          predictions,
          pregenerationTasks,
          message: `Analyzed ${patterns.length} patterns, triggered ${pregenerationTasks.length} pregenerations`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'pregenerate': {
        // Pré-générer la musique pour des émotions spécifiques
        const targetEmotions = emotions || ['calm', 'stress', 'concentration'];
        
        const results = await triggerPregeneration(
          supabase,
          userId || 'global',
          targetEmotions,
          SUNO_API_BASE,
          forceRegenerate
        );

        return new Response(JSON.stringify({
          success: true,
          results,
          message: `Pre-generated ${results.length} tracks`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'status': {
        // Vérifier le statut du cache de pré-génération
        const cacheStatus = await getCacheStatus(supabase, userId);

        return new Response(JSON.stringify({
          success: true,
          cache: cacheStatus
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get-cached': {
        // Récupérer une piste pré-générée depuis le cache
        const emotion = parcours || emotions?.[0] || 'calm';
        const cachedTrack = await getCachedTrack(supabase, userId, emotion);

        if (cachedTrack) {
          return new Response(JSON.stringify({
            success: true,
            track: cachedTrack,
            fromCache: true
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Si pas de cache, générer en temps réel avec fallback
        return new Response(JSON.stringify({
          success: false,
          fromCache: false,
          message: 'No cached track available, generation needed'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'cleanup': {
        // Nettoyer les anciennes entrées du cache
        const cleanedCount = await cleanupOldCache(supabase);

        return new Response(JSON.stringify({
          success: true,
          cleanedCount,
          message: `Cleaned ${cleanedCount} old cache entries`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error: any) {
    console.error('[pregeneration] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error?.message || 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Analyser les patterns émotionnels de l'utilisateur
async function analyzeUserEmotionPatterns(
  supabase: any, 
  userId: string
): Promise<EmotionPattern[]> {
  // Récupérer les scans émotionnels des 30 derniers jours
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: scans, error } = await supabase
    .from('emotion_scans')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[pregeneration] Error fetching scans:', error);
    return [];
  }

  // Analyser les patterns
  const emotionStats: Record<string, {
    count: number;
    totalIntensity: number;
    timeSlots: Set<string>;
    lastSeen: string;
  }> = {};

  for (const scan of scans || []) {
    const scores = scan.scores || {};
    const createdAt = new Date(scan.created_at);
    const timeSlot = getTimeSlot(createdAt);

    // Trouver l'émotion dominante
    let dominant = 'neutral';
    let maxScore = 0;
    for (const [emotion, score] of Object.entries(scores)) {
      if (typeof score === 'number' && score > maxScore) {
        maxScore = score;
        dominant = emotion;
      }
    }

    if (!emotionStats[dominant]) {
      emotionStats[dominant] = {
        count: 0,
        totalIntensity: 0,
        timeSlots: new Set(),
        lastSeen: scan.created_at
      };
    }

    emotionStats[dominant].count++;
    emotionStats[dominant].totalIntensity += maxScore;
    emotionStats[dominant].timeSlots.add(timeSlot);
  }

  // Convertir en tableau de patterns
  return Object.entries(emotionStats)
    .map(([emotion, stats]) => ({
      emotion,
      frequency: stats.count,
      avgIntensity: stats.totalIntensity / stats.count,
      timeSlots: Array.from(stats.timeSlots),
      lastSeen: stats.lastSeen
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

// Prédire les prochaines émotions basées sur les patterns
function predictNextEmotions(patterns: EmotionPattern[]): Array<{
  emotion: string;
  probability: number;
  reason: string;
}> {
  const now = new Date();
  const currentTimeSlot = getTimeSlot(now);
  const dayOfWeek = now.getDay();

  const predictions: Array<{ emotion: string; probability: number; reason: string }> = [];

  // Top 5 émotions les plus fréquentes
  const topEmotions = patterns.slice(0, 5);

  for (const pattern of topEmotions) {
    let probability = pattern.frequency / (patterns[0]?.frequency || 1);

    // Boost si l'émotion est fréquente dans ce créneau horaire
    if (pattern.timeSlots.includes(currentTimeSlot)) {
      probability *= 1.3;
    }

    // Ajuster selon le jour de la semaine
    if ((dayOfWeek === 0 || dayOfWeek === 6) && ['calm', 'nostalgie'].includes(pattern.emotion)) {
      probability *= 1.2; // Weekend = plus calme/nostalgique
    }
    if (dayOfWeek === 1 && ['stress', 'apathie'].includes(pattern.emotion)) {
      probability *= 1.3; // Lundi = plus de stress
    }

    predictions.push({
      emotion: pattern.emotion,
      probability: Math.min(probability, 1),
      reason: `Fréquence: ${pattern.frequency}, dernière: ${pattern.lastSeen}`
    });
  }

  // Toujours inclure calm et neutral comme base
  if (!predictions.find(p => p.emotion === 'calm')) {
    predictions.push({ emotion: 'calm', probability: 0.5, reason: 'Base universelle' });
  }
  if (!predictions.find(p => p.emotion === 'neutral')) {
    predictions.push({ emotion: 'neutral', probability: 0.4, reason: 'Base universelle' });
  }

  return predictions.sort((a, b) => b.probability - a.probability).slice(0, 6);
}

// Déclencher la pré-génération pour les émotions
async function triggerPregeneration(
  supabase: any,
  userId: string,
  emotions: string[],
  sunoApiBase: string,
  forceRegenerate = false
): Promise<Array<{ emotion: string; taskId?: string; status: string; fromCache?: boolean }>> {
  const SUNO_API_KEY = Deno.env.get('SUNO_API_KEY');
  const results: Array<{ emotion: string; taskId?: string; status: string; fromCache?: boolean }> = [];

  for (const emotion of emotions) {
    const emotionKey = normalizeEmotion(emotion);
    const config = EMOTION_PARCOURS_CONFIG[emotionKey] || EMOTION_PARCOURS_CONFIG.neutral;

    // Vérifier si déjà en cache et valide
    if (!forceRegenerate) {
      const cached = await getCachedTrack(supabase, userId, emotionKey);
      if (cached && cached.status === 'completed') {
        results.push({ emotion: emotionKey, status: 'cached', fromCache: true });
        console.log(`[pregeneration] ${emotionKey}: Already cached`);
        continue;
      }
    }

    // Vérifier si une génération est en cours
    const { data: pending } = await supabase
      .from('music_pregeneration_cache')
      .select('*')
      .eq('user_id', userId)
      .eq('emotion', emotionKey)
      .eq('status', 'generating')
      .single();

    if (pending) {
      results.push({ emotion: emotionKey, taskId: pending.task_id, status: 'generating' });
      console.log(`[pregeneration] ${emotionKey}: Already generating`);
      continue;
    }

    // Générer nouvelle piste
    if (!SUNO_API_KEY) {
      // Fallback sans API key
      results.push({ emotion: emotionKey, status: 'fallback' });
      continue;
    }

    try {
      const bpm = Math.floor((config.bpmRange[0] + config.bpmRange[1]) / 2);
      const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/suno-callback`;

      const response = await fetch(`${sunoApiBase}/api/v1/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUNO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customMode: true,
          instrumental: config.instrumental,
          model: config.model,
          prompt: config.prompt,
          style: `${config.style}, ${bpm} BPM`,
          title: `Pre-gen: ${emotionKey}`,
          callBackUrl: callbackUrl
        })
      });

      if (!response.ok) {
        console.error(`[pregeneration] Suno error for ${emotionKey}:`, await response.text());
        results.push({ emotion: emotionKey, status: 'error' });
        continue;
      }

      const sunoData = await response.json();
      const taskId = sunoData?.data?.taskId || sunoData?.taskId;

      // Sauvegarder dans le cache
      await supabase
        .from('music_pregeneration_cache')
        .upsert({
          user_id: userId,
          emotion: emotionKey,
          task_id: taskId,
          status: 'generating',
          config: config,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,emotion'
        });

      results.push({ emotion: emotionKey, taskId, status: 'generating' });
      console.log(`[pregeneration] ${emotionKey}: Started generation, taskId: ${taskId}`);

    } catch (error) {
      console.error(`[pregeneration] Error for ${emotionKey}:`, error);
      results.push({ emotion: emotionKey, status: 'error' });
    }
  }

  return results;
}

// Récupérer une piste depuis le cache
async function getCachedTrack(
  supabase: any,
  userId: string | undefined,
  emotion: string
): Promise<any | null> {
  const emotionKey = normalizeEmotion(emotion);

  // Chercher d'abord pour l'utilisateur spécifique
  if (userId) {
    const { data: userCache } = await supabase
      .from('music_pregeneration_cache')
      .select('*')
      .eq('user_id', userId)
      .eq('emotion', emotionKey)
      .eq('status', 'completed')
      .single();

    if (userCache && isValidCache(userCache)) {
      return userCache;
    }
  }

  // Sinon chercher dans le cache global
  const { data: globalCache } = await supabase
    .from('music_pregeneration_cache')
    .select('*')
    .eq('user_id', 'global')
    .eq('emotion', emotionKey)
    .eq('status', 'completed')
    .single();

  if (globalCache && isValidCache(globalCache)) {
    return globalCache;
  }

  return null;
}

// Vérifier si le cache est valide (moins de 24h)
function isValidCache(cache: any): boolean {
  const updatedAt = new Date(cache.updated_at);
  const now = new Date();
  const hoursDiff = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);
  return hoursDiff < 24;
}

// Obtenir le statut du cache
async function getCacheStatus(supabase: any, userId?: string): Promise<{
  totalCached: number;
  byEmotion: Record<string, { status: string; audioUrl?: string; updatedAt: string }>;
  globalCached: number;
}> {
  const { data: userCache } = await supabase
    .from('music_pregeneration_cache')
    .select('*')
    .eq('user_id', userId || 'global');

  const { data: globalCache } = await supabase
    .from('music_pregeneration_cache')
    .select('*')
    .eq('user_id', 'global');

  const byEmotion: Record<string, any> = {};
  for (const entry of userCache || []) {
    byEmotion[entry.emotion] = {
      status: entry.status,
      audioUrl: entry.audio_url,
      updatedAt: entry.updated_at
    };
  }

  return {
    totalCached: (userCache || []).filter((c: any) => c.status === 'completed').length,
    byEmotion,
    globalCached: (globalCache || []).filter((c: any) => c.status === 'completed').length
  };
}

// Nettoyer les anciennes entrées du cache
async function cleanupOldCache(supabase: any): Promise<number> {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const { data, error } = await supabase
    .from('music_pregeneration_cache')
    .delete()
    .lt('updated_at', oneDayAgo.toISOString())
    .select();

  if (error) {
    console.error('[pregeneration] Cleanup error:', error);
    return 0;
  }

  return data?.length || 0;
}

// Normaliser le nom de l'émotion
function normalizeEmotion(emotion: string): string {
  const mappings: Record<string, string> = {
    'anxious': 'stress',
    'stressed': 'stress',
    'overwhelmed': 'stress',
    'tired': 'burnout',
    'exhausted': 'burnout',
    'fatigue': 'burnout',
    'motivated': 'motivation',
    'energetic': 'motivation',
    'focused': 'concentration',
    'distracted': 'concentration',
    'nostalgic': 'nostalgie',
    'melancholic': 'nostalgie',
    'sensitive': 'hypersensibilite',
    'overstimulated': 'hypersensibilite',
    'fearful': 'peur',
    'scared': 'peur',
    'angry': 'colere',
    'irritated': 'colere',
    'apathetic': 'apathie',
    'unmotivated': 'apathie',
    'pain': 'douleur',
    'perfectionist': 'perfectionnisme',
    'happy': 'calm',
    'joy': 'calm',
    'peaceful': 'calm',
    'relaxed': 'calm'
  };

  return mappings[emotion.toLowerCase()] || emotion.toLowerCase();
}

// Déterminer le créneau horaire
function getTimeSlot(date: Date): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 9) return 'morning-early';
  if (hour >= 9 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 21) return 'evening';
  return 'night';
}
