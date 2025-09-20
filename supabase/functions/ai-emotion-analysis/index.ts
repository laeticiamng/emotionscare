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
  text?: string;
  audioBase64?: string;
  audioUrl?: string;
  locale?: string;
  context?: string;
  previousEmotions?: Record<string, number>;
}

type EmotionKey =
  | 'joie'
  | 'confiance'
  | 'anticipation'
  | 'surprise'
  | 'tristesse'
  | 'colere'
  | 'peur'
  | 'degout';

type EmotionRecord = Record<EmotionKey, number>;

interface HumeEmotionScore {
  name: string;
  score: number;
}

const EMOTION_KEYS: EmotionKey[] = [
  'joie',
  'confiance',
  'anticipation',
  'surprise',
  'tristesse',
  'colere',
  'peur',
  'degout'
];

const POSITIVE_KEYS: EmotionKey[] = ['joie', 'confiance', 'anticipation', 'surprise'];
const NEGATIVE_KEYS: EmotionKey[] = ['tristesse', 'colere', 'peur', 'degout'];

const HUME_TO_INTERNAL: Record<string, EmotionKey> = {
  joy: 'joie',
  excited: 'joie',
  happy: 'joie',
  calm: 'confiance',
  relaxed: 'confiance',
  serene: 'confiance',
  confident: 'confiance',
  anticipation: 'anticipation',
  interested: 'anticipation',
  curiosity: 'anticipation',
  alert: 'anticipation',
  attentive: 'surprise',
  surprise: 'surprise',
  awe: 'surprise',
  sad: 'tristesse',
  sadness: 'tristesse',
  melancholy: 'tristesse',
  anger: 'colere',
  angry: 'colere',
  frustrated: 'colere',
  annoyed: 'colere',
  fear: 'peur',
  anxious: 'peur',
  nervous: 'peur',
  tense: 'peur',
  disgust: 'degout',
  contempt: 'degout',
  shame: 'degout',
  disgusted: 'degout'
};

const INTERNAL_TO_HUME: Record<EmotionKey, string> = {
  joie: 'joy',
  confiance: 'calm',
  anticipation: 'anticipation',
  surprise: 'surprise',
  tristesse: 'sad',
  colere: 'anger',
  peur: 'fear',
  degout: 'disgust'
};

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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function roundToSingleDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function initEmotionRecord(): EmotionRecord {
  return {
    joie: 0,
    confiance: 0,
    anticipation: 0,
    surprise: 0,
    tristesse: 0,
    colere: 0,
    peur: 0,
    degout: 0
  };
}

function createNeutralRecord(): EmotionRecord {
  return {
    joie: 5,
    confiance: 4.5,
    anticipation: 4,
    surprise: 3.5,
    tristesse: 2.5,
    colere: 2,
    peur: 2,
    degout: 1.5
  };
}

function aggregateScoresToRecord(scores: HumeEmotionScore[]): EmotionRecord {
  const accumulator: Record<EmotionKey, number[]> = {
    joie: [],
    confiance: [],
    anticipation: [],
    surprise: [],
    tristesse: [],
    colere: [],
    peur: [],
    degout: []
  };

  for (const emotion of scores) {
    const key = HUME_TO_INTERNAL[emotion.name.toLowerCase()];
    if (!key || typeof emotion.score !== 'number' || Number.isNaN(emotion.score)) {
      continue;
    }
    accumulator[key].push(clamp(emotion.score, 0, 1));
  }

  const record = initEmotionRecord();
  for (const key of EMOTION_KEYS) {
    const values = accumulator[key];
    if (values.length > 0) {
      const avg = values.reduce((total, value) => total + value, 0) / values.length;
      record[key] = roundToSingleDecimal(avg * 10);
    }
  }

  return record;
}

function parseLikertSummary(text: string) {
  const positivePatterns: Record<string, RegExp> = {
    actif: /Actif\(ve\)\s*:\s*(\d)/iu,
    determine: /D[ée]termin[ée]\(e\)\s*:\s*(\d)/iu,
    attentif: /Attentif\(ve\)\s*:\s*(\d)/iu,
    inspire: /Inspir[ée]\(e\)\s*:\s*(\d)/iu,
    alerte: /Alerte\s*:\s*(\d)/iu
  };

  const negativePatterns: Record<string, RegExp> = {
    contrarie: /Contrari[ée]\(e\)\s*:\s*(\d)/iu,
    hostile: /Hostile\s*:\s*(\d)/iu,
    honteux: /Honteux\(se\)\s*:\s*(\d)/iu,
    nerveux: /Nerveux\(se\)\s*:\s*(\d)/iu,
    effraye: /Effray[ée]\(e\)\s*:\s*(\d)/iu
  };

  function extract(patterns: Record<string, RegExp>) {
    return Object.fromEntries(
      Object.entries(patterns).map(([key, regex]) => {
        const match = regex.exec(text);
        return [key, match ? Number.parseInt(match[1], 10) : undefined];
      })
    ) as Record<string, number | undefined>;
  }

  return {
    positives: extract(positivePatterns),
    negatives: extract(negativePatterns)
  };
}

function average(values: Array<number | undefined>) {
  const filtered = values.filter((value): value is number => typeof value === 'number' && !Number.isNaN(value));
  if (filtered.length === 0) {
    return 0;
  }
  const sum = filtered.reduce((total, value) => total + value, 0);
  return sum / filtered.length;
}

function buildRecordFromText(text: string | undefined): { record: EmotionRecord; scores: HumeEmotionScore[] } {
  if (!text) {
    return {
      record: initEmotionRecord(),
      scores: []
    };
  }

  const { positives, negatives } = parseLikertSummary(text);

  const record = initEmotionRecord();

  record.joie = roundToSingleDecimal(clamp(average([positives.actif, positives.inspire]) * 2, 0, 10));
  record.confiance = roundToSingleDecimal(clamp((positives.determine ?? 0) * 2, 0, 10));
  record.anticipation = roundToSingleDecimal(clamp((positives.alerte ?? positives.attentif ?? 0) * 2, 0, 10));
  record.surprise = roundToSingleDecimal(clamp((positives.attentif ?? 0) * 2, 0, 10));

  record.tristesse = roundToSingleDecimal(clamp(average([negatives.contrarie, negatives.honteux]) * 2, 0, 10));
  record.colere = roundToSingleDecimal(clamp((negatives.hostile ?? 0) * 2, 0, 10));
  record.peur = roundToSingleDecimal(clamp(average([negatives.nerveux, negatives.effraye]) * 2, 0, 10));
  record.degout = roundToSingleDecimal(clamp((negatives.honteux ?? negatives.contrarie ?? 0) * 2, 0, 10));

  return { record, scores: recordToHumeScores(record) };
}

function computeNormalizedBalance(record: EmotionRecord) {
  const positive = POSITIVE_KEYS.reduce((total, key) => total + record[key], 0);
  const negative = NEGATIVE_KEYS.reduce((total, key) => total + record[key], 0);
  const raw = positive - negative;
  return Math.round(clamp(((raw + 40) / 80) * 100, 0, 100));
}

function isRecordEmpty(record: EmotionRecord) {
  return EMOTION_KEYS.every((key) => !record[key] || record[key] <= 0);
}

function findDominantEmotion(record: EmotionRecord) {
  let dominant: EmotionKey = 'joie';
  let score = -Infinity;
  for (const key of EMOTION_KEYS) {
    if (record[key] > score) {
      score = record[key];
      dominant = key;
    }
  }
  return { key: dominant, score: score <= 0 ? 0 : score };
}

function computeConfidenceFromScore(score: number) {
  if (score <= 0) {
    return 0.35;
  }
  const normalized = clamp(score / 10, 0, 1);
  return clamp(0.4 + normalized * 0.6, 0.4, 0.98);
}

function buildInsights(
  mapped: ReturnType<typeof mapEmotionToSignal>,
  dominant: { key: EmotionKey; score: number },
  balance: number,
  previous?: Record<string, number>
) {
  const insights = new Set<string>();
  insights.add(mapped.label);

  const dominantScoreText = dominant.score > 0 ? `${dominant.score.toFixed(1)}/10` : 'faible';
  insights.add(`Émotion dominante détectée: ${dominant.key} (intensité ${dominantScoreText}).`);
  insights.add(`Équilibre émotionnel estimé à ${balance}/100.`);

  if (previous && typeof previous[dominant.key] === 'number') {
    const delta = roundToSingleDecimal(dominant.score - previous[dominant.key]!);
    if (Math.abs(delta) >= 0.5) {
      insights.add(
        delta > 0
          ? `Progression notable sur ${dominant.key}: +${delta.toFixed(1)} point(s) vs dernier scan.`
          : `Baisse perçue sur ${dominant.key}: ${delta.toFixed(1)} point(s) vs dernier scan.`
      );
    }
  }

  return Array.from(insights);
}

function ensureRecommendations(mapped: ReturnType<typeof mapEmotionToSignal>) {
  if (mapped.cues.length > 0) {
    return mapped.cues;
  }
  return [
    'Respirez profondément pendant 60 secondes pour vous recentrer.',
    'Identifiez une action concrète pour soutenir votre état émotionnel actuel.'
  ];
}

function recordToHumeScores(record: EmotionRecord): HumeEmotionScore[] {
  return EMOTION_KEYS.map((key) => ({
    name: INTERNAL_TO_HUME[key],
    score: clamp(record[key] / 10, 0, 1)
  }));
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

  const hasAudio = Boolean(payload.audioBase64 || payload.audioUrl);
  const hasText = typeof payload.text === 'string' && payload.text.trim().length > 0;

  if (!hasAudio && !hasText) {
    return new Response(JSON.stringify({ error: 'Un texte descriptif ou un segment audio est requis' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (payload.audioBase64) {
    const approxBytes = decodeBase64Size(payload.audioBase64);
    if (approxBytes > MAX_AUDIO_BYTES) {
      return new Response(JSON.stringify({ error: 'Le segment audio dépasse la taille autorisée' }), {
        status: 413,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  let emotionRecord: EmotionRecord = initEmotionRecord();
  let humeScores: HumeEmotionScore[] = [];

  if (hasAudio) {
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
      if (!hasText) {
        return new Response(JSON.stringify({ error: 'Analyse indisponible' }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } else {
      try {
        const humePayload = await humeResponse.json();
        humeScores = extractEmotionScores(humePayload);
        emotionRecord = aggregateScoresToRecord(humeScores);
      } catch (error) {
        console.error('Impossible de décoder la réponse Hume', { message: (error as Error).message });
        if (!hasText) {
          return new Response(JSON.stringify({ error: 'Réponse Hume illisible' }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
    }
  }

  if (hasText && (isRecordEmpty(emotionRecord) || !hasAudio)) {
    const textAnalysis = buildRecordFromText(payload.text);
    if (isRecordEmpty(emotionRecord)) {
      emotionRecord = textAnalysis.record;
    } else {
      // blend audio-driven record with text-derived cues for additional context
      for (const key of EMOTION_KEYS) {
        if (textAnalysis.record[key] > 0) {
          emotionRecord[key] = roundToSingleDecimal(
            clamp((emotionRecord[key] + textAnalysis.record[key]) / 2, 0, 10)
          );
        }
      }
    }
    if (humeScores.length === 0) {
      humeScores = textAnalysis.scores;
    }
  }

  if (isRecordEmpty(emotionRecord)) {
    emotionRecord = createNeutralRecord();
  }

  if (humeScores.length === 0) {
    humeScores = recordToHumeScores(emotionRecord);
  }

  const mapped = mapEmotionToSignal(humeScores);
  const dominant = findDominantEmotion(emotionRecord);
  const confidence = computeConfidenceFromScore(dominant.score);
  const balance = computeNormalizedBalance(emotionRecord);
  const insights = buildInsights(mapped, dominant, balance, payload.previousEmotions);
  const recommendations = ensureRecommendations(mapped);

  const responsePayload = {
    emotions: emotionRecord,
    dominantEmotion: dominant.key,
    confidence,
    insights,
    recommendations,
    emotionalBalance: balance,
    persisted: false,
    scanId: null
  };

  return new Response(JSON.stringify(responsePayload), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=0, s-maxage=0' }
  });
});
