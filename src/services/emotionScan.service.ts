import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

const POSITIVE_KEYS = ['joie', 'confiance', 'anticipation', 'surprise'] as const;
const NEGATIVE_KEYS = ['tristesse', 'colere', 'peur', 'degout'] as const;

const analysisResponseSchema = z.object({
  emotions: z.record(z.number()),
  dominantEmotion: z.string(),
  confidence: z.number(),
  insights: z.array(z.string()),
  recommendations: z.array(z.string()),
  emotionalBalance: z.number().optional(),
  persisted: z.boolean().optional(),
  scanId: z.string().optional(),
});

export interface EmotionAnalysisResult {
  emotions: Record<string, number>;
  dominantEmotion: string;
  confidence: number;
  insights: string[];
  recommendations: string[];
  emotionalBalance: number;
  persisted?: boolean;
  scanId?: string | null;
}

export type EmotionScanRow = Database['public']['Tables']['emotion_scans']['Row'];

export interface EmotionScanHistoryEntry {
  id: string;
  createdAt: string;
  mood: string | null;
  summary: string | null;
  confidence: number;
  recommendations: string[];
  insights: string[];
  scores: Record<string, number>;
  normalizedBalance: number;
  scanType: string | null;
}

interface InvokePayload {
  text: string;
  context?: string;
  previousEmotions?: Record<string, number>;
}

interface EmotionScanInvokeOptions {
  accessToken?: string | null;
}

export interface PersistEmotionScanInput {
  userId: string;
  mood: string | null;
  confidence: number;
  summary: string;
  recommendations: string[];
  insights: string[];
  emotions: Record<string, number>;
  emotionalBalance: number;
  scanType?: string | null;
  context?: string;
  previousEmotions?: Record<string, number> | null;
}

function coerceNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function computeNormalizedBalance(scores?: Record<string, number>): number {
  if (!scores || Object.keys(scores).length === 0) {
    return 50;
  }

  const positive = POSITIVE_KEYS.reduce((total, key) => total + coerceNumber(scores[key]), 0);
  const negative = NEGATIVE_KEYS.reduce((total, key) => total + coerceNumber(scores[key]), 0);

  const raw = positive - negative;
  const normalized = ((raw + 40) / 80) * 100;

  return Math.max(0, Math.min(100, Math.round(normalized)));
}

function coerceStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map(item => (typeof item === 'string' ? item : null))
      .filter((item): item is string => !!item);
  }
  return [];
}

export async function invokeEmotionScan(
  payload: InvokePayload,
  options: EmotionScanInvokeOptions = {},
): Promise<EmotionAnalysisResult> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const { data, error } = await supabase.functions.invoke('ai-emotion-analysis', {
    body: payload,
    headers,
  });

  if (error) {
    throw new Error(error.message || 'Échec de l\'analyse émotionnelle');
  }

  const parsed = analysisResponseSchema.safeParse(data);
  if (!parsed.success) {
    console.error('Invalid analysis payload', parsed.error.format());
    throw new Error("Réponse d'analyse émotionnelle invalide");
  }

  const confidencePercent = Math.round(parsed.data.confidence * 100);
  const normalizedBalance = parsed.data.emotionalBalance ?? computeNormalizedBalance(parsed.data.emotions);

  return {
    emotions: parsed.data.emotions,
    dominantEmotion: parsed.data.dominantEmotion,
    confidence: confidencePercent,
    insights: parsed.data.insights,
    recommendations: parsed.data.recommendations,
    emotionalBalance: normalizedBalance,
    persisted: parsed.data.persisted ?? false,
    scanId: parsed.data.scanId ?? null,
  };
}

export async function persistEmotionScanResult(
  input: PersistEmotionScanInput,
): Promise<EmotionScanRow> {
  const persistedPayload = {
    scores: input.emotions,
    insights: input.insights,
    context: input.context ?? null,
    previousEmotions: input.previousEmotions ?? null,
  };

  const { data, error } = await supabase
    .from('emotion_scans')
    .insert({
      user_id: input.userId,
      scan_type: input.scanType ?? 'self-report',
      mood: input.mood,
      confidence: input.confidence,
      summary: input.summary,
      recommendations: input.recommendations,
      insights: input.insights,
      emotions: persistedPayload,
      emotional_balance: input.emotionalBalance,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Impossible de sauvegarder le scan émotionnel');
  }

  return data as EmotionScanRow;
}

export function mapScanRow(row: EmotionScanRow): EmotionScanHistoryEntry {
  const rawPayload = (row.emotions ?? {}) as
    | {
        scores?: Record<string, number>;
        insights?: string[];
        context?: string | null;
        previousEmotions?: Record<string, number> | null;
      }
    | Record<string, number>;

  const scores =
    'scores' in rawPayload
      ? (rawPayload.scores ?? {})
      : (rawPayload as Record<string, number>);

  const normalizedBalance = row.emotional_balance !== null && row.emotional_balance !== undefined
    ? coerceNumber(row.emotional_balance)
    : computeNormalizedBalance(scores);

  const insights = row.insights?.length
    ? row.insights
    : 'insights' in rawPayload
      ? coerceStringArray(rawPayload.insights)
      : [];

  return {
    id: row.id,
    createdAt: row.created_at ?? new Date().toISOString(),
    mood: row.mood ?? null,
    summary: row.summary ?? null,
    confidence: Math.round(coerceNumber(row.confidence)),
    recommendations: coerceStringArray(row.recommendations),
    insights,
    scores,
    normalizedBalance,
    scanType: row.scan_type ?? null,
  };
}

export async function getEmotionScanHistory(userId: string, limit = 12): Promise<EmotionScanHistoryEntry[]> {
  const { data, error } = await supabase
    .from('emotion_scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message || 'Impossible de récupérer les scans émotionnels');
  }

  return (data ?? []).map(mapScanRow);
}

export function deriveScore10(normalizedBalance: number): number {
  return Math.round((normalizedBalance / 10) * 10) / 10;
}

export function summarizeLikertAnswers(
  positives: Array<{ id: string; label: string; value: number | undefined }>,
  negatives: Array<{ id: string; label: string; value: number | undefined }>,
  balance: number,
): string {
  const positiveSummary = positives
    .map(item => `${item.label}: ${item.value ?? 0}/5`)
    .join(', ');

  const negativeSummary = negatives
    .map(item => `${item.label}: ${item.value ?? 0}/5`)
    .join(', ');

  return [
    'Auto-évaluation émotionnelle (I-PANAS-SF).',
    `Scores positifs → ${positiveSummary}.`,
    `Scores négatifs → ${negativeSummary}.`,
    `Balance perçue: ${balance >= 0 ? '+' : ''}${balance} (PA - NA).`,
  ].join(' ');
}

export function computeBalanceFromScores(scores: Record<string, number>): number {
  return computeNormalizedBalance(scores);
}
