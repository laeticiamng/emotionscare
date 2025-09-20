import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { supabase } from "../_shared/supa_client.ts";

const rawOrigins = Deno.env.get('HUME_ALLOWED_ORIGINS') ?? Deno.env.get('CORS_ORIGINS') ?? '';
const allowedOrigins = rawOrigins
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

const MAX_AUDIO_BYTES = 5 * 1024 * 1024;

interface EmotionAnalysisRequest {
  audioBase64?: string;
  audioUrl?: string;
  locale?: string;
  context?: string;
}

interface HumeEmotionScore {
  name: string;
  score: number;
}

function resolveOrigin(request: Request) {
  const origin = request.headers.get('origin') ?? request.headers.get('Origin') ?? '';
  if (allowedOrigins.length === 0) {
    return origin || '*';
  }
  if (allowedOrigins.includes('*')) {
    return origin || '*';
  }
  return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
}

function createCorsHeaders(request: Request) {
  const allowOrigin = resolveOrigin(request);
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  } as const;
}

function isFeatureEnabled() {
  return (Deno.env.get('FF_HUME_ANALYSIS') ?? 'false').toLowerCase() === 'true';
}

function decodeBase64Size(base64?: string) {
  if (!base64) {
    return 0;
  }
  const padding = (base64.match(/=+$/) ?? [''])[0].length;
  return (base64.length * 3) / 4 - padding;
}

async function authenticate(request: Request) {
  const authHeader = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    console.warn('Hume analysis: échec auth', { reason: error?.message ?? 'no-user' });
    return null;
  }
  return data.user.id;
}

function mapEmotionToSignal(emotions: HumeEmotionScore[]): {
  label: string;
  signal: string;
  cues: string[];
} {
  if (emotions.length === 0) {
    return {
      label: 'Ambiance équilibrée détectée',
      signal: 'keep_current_mix',
      cues: ['Maintenir un fond doux', 'Inviter une respiration calme']
    };
  }

  const sorted = emotions
    .filter((item) => typeof item.name === 'string' && typeof item.score === 'number')
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const dominant = sorted[0];
  const score = dominant?.score ?? 0;
  const name = dominant?.name?.toLowerCase() ?? 'balanced';

  if (['frustrated', 'anger', 'tense'].includes(name) && score > 0.3) {
    return {
      label: 'Tension repérée, on adoucit l’ambiance',
      signal: 'long_exhale',
      cues: ['Allonger l’expiration', 'Apaiser la lumière sonore']
    };
  }

  if (['calm', 'relaxed', 'serene'].includes(name) && score > 0.3) {
    return {
      label: 'Climat apaisé confirmé',
      signal: 'soften_audio',
      cues: ['Renforcer la nappe chaleureuse', 'Inviter à savourer le calme']
    };
  }

  if (['sad', 'low_energy', 'melancholy'].includes(name) && score > 0.3) {
    return {
      label: 'Besoin de réconfort identifié',
      signal: 'warm_palette',
      cues: ['Ajouter des textures chaleureuses', 'Suggérer une respiration enveloppante']
    };
  }

  if (['excited', 'joy', 'anticipation'].includes(name) && score > 0.3) {
    return {
      label: 'Élan positif à canaliser',
      signal: 'smooth_anchor',
      cues: ['Proposer un ancrage doux', 'Maintenir un tempo stable']
    };
  }

  return {
    label: 'Énergie mixte, soutien équilibré',
    signal: 'balanced_support',
    cues: ['Stabiliser la scène sonore', 'Guider vers une respiration régulière']
  };
}

function extractEmotionScores(humePayload: unknown): HumeEmotionScore[] {
  if (!humePayload || typeof humePayload !== 'object') {
    return [];
  }
  const predictions = (humePayload as { predictions?: unknown[] }).predictions;
  if (!Array.isArray(predictions)) {
    return [];
  }

  const scores: HumeEmotionScore[] = [];

  for (const prediction of predictions) {
    const results = (prediction as { results?: Record<string, unknown> }).results;
    if (!results) continue;

    const voiceEntries = Object.values(results);
    for (const entry of voiceEntries) {
      const prosody = (entry as { predictions?: Array<{ emotions?: HumeEmotionScore[] }> }).predictions;
      if (!Array.isArray(prosody)) continue;
      for (const item of prosody) {
        if (Array.isArray(item.emotions)) {
          for (const emotion of item.emotions) {
            if (emotion && typeof emotion.name === 'string' && typeof emotion.score === 'number') {
              scores.push({ name: emotion.name, score: emotion.score });
            }
          }
        }
      }
    }
  }

  return scores;
}

serve(async (req) => {
  const corsHeaders = createCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!isFeatureEnabled()) {
    return new Response(JSON.stringify({ error: 'Analyse émotionnelle désactivée' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const userId = await authenticate(req);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Authentification requise' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  let payload: EmotionAnalysisRequest;
  try {
    payload = await req.json();
  } catch (_error) {
    return new Response(JSON.stringify({ error: 'Corps JSON invalide' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (!payload.audioBase64 && !payload.audioUrl) {
    return new Response(JSON.stringify({ error: 'Audio requis (base64 ou URL signée)' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const approxBytes = decodeBase64Size(payload.audioBase64);
  if (approxBytes > MAX_AUDIO_BYTES) {
    return new Response(JSON.stringify({ error: 'Le segment audio dépasse la taille autorisée' }), {
      status: 413,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const humeApiKey = Deno.env.get('HUME_API_KEY');
  if (!humeApiKey) {
    return new Response(JSON.stringify({ error: 'Intégration Hume indisponible' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const requestBody = payload.audioUrl
    ? { url: payload.audioUrl, context: payload.context, language: payload.locale }
    : { data: payload.audioBase64, context: payload.context, language: payload.locale };

  let humeResponse: Response;
  try {
    humeResponse = await fetch('https://api.hume.ai/v0/emotions/voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hume-Api-Key': humeApiKey,
        'User-Agent': 'emotionscare-edge/1.0'
      },
      body: JSON.stringify(requestBody)
    });
  } catch (error) {
    console.error('Hume fetch error', { message: (error as Error).message });
    return new Response(JSON.stringify({ error: 'Service émotionnel indisponible' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (!humeResponse.ok) {
    const safeBody = await humeResponse.text();
    console.error('Hume API a renvoyé une erreur', { status: humeResponse.status, message: safeBody.slice(0, 160) });
    return new Response(JSON.stringify({ error: 'Analyse indisponible' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  let humePayload: unknown;
  try {
    humePayload = await humeResponse.json();
  } catch (error) {
    console.error('Impossible de décoder la réponse Hume', { message: (error as Error).message });
    return new Response(JSON.stringify({ error: 'Réponse Hume illisible' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const scores = extractEmotionScores(humePayload);
  const mapped = mapEmotionToSignal(scores);

  const narrative = {
    label: mapped.label,
    signal: mapped.signal,
    cues: mapped.cues,
    meta: {
      source: 'hume_voice'
    }
  };

  return new Response(JSON.stringify(narrative), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=0, s-maxage=0' }
  });
});
