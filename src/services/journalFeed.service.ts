import httpClient from '@/services/api/httpClient';
import { DataValidator, sanitizeInput as sanitizePlain, secureTextSchema } from '@/lib/validation/dataValidator';

const EMOTION_VECTOR_LENGTH = 8;

export type JournalFeedEntry = {
  id: string;
  type: 'text' | 'voice';
  timestamp: string;
  text: string;
  summary?: string;
  tags: string[];
  valence?: number;
  mood?: 'positive' | 'neutral' | 'negative';
  origin: 'remote' | 'local';
};

type RawFeedEntry = {
  id: string;
  ts?: string;
  type?: string;
  created_at?: string;
  text_raw?: string;
  preview?: string;
  summary?: string;
  summary_120?: string;
  styled_html?: string;
  tags?: string[];
  tag_set?: string[];
  meta?: { tags?: string[] };
  valence?: number;
};

type JournalFeedResponse = {
  ok: boolean;
  data?: {
    entries?: RawFeedEntry[];
  };
};

type CreateEntryResponse = {
  ok: boolean;
  data?: {
    id: string;
    ts: string;
  };
};

const stripHtml = (html: string): string => {
  const tmp = typeof window !== 'undefined' ? window.document.createElement('div') : null;
  if (tmp) {
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
  return html.replace(/<[^>]*>/g, '');
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const normalizeTag = (tag: string): string => {
  const withoutHash = tag.startsWith('#') ? tag.slice(1) : tag;
  const trimmed = sanitizePlain(withoutHash)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_-]+/gu, '');
  return trimmed;
};

const extractTags = (source: string | undefined, extra: string[] = []): string[] => {
  const fromText = source ? Array.from(source.match(/#([\p{L}\p{N}_-]{2,24})/gu) || []).map(tag => normalizeTag(tag)) : [];
  const normalizedExtras = extra.map(normalizeTag);
  return Array.from(new Set([...fromText, ...normalizedExtras].filter(Boolean)));
};

const deriveMood = (valence?: number): 'positive' | 'neutral' | 'negative' | undefined => {
  if (typeof valence !== 'number') return undefined;
  if (valence > 0.15) return 'positive';
  if (valence < -0.15) return 'negative';
  return 'neutral';
};

const buildEmotionVector = (valence: number): number[] => {
  const clamped = Math.max(-1, Math.min(1, valence));
  return Array.from({ length: EMOTION_VECTOR_LENGTH }, () => clamped);
};

const buildHtml = (raw: string): string => {
  const escaped = escapeHtml(raw);
  const paragraphs = escaped
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => `<p>${block.replace(/\n/g, '<br />')}</p>`)
    .join('');
  return DataValidator.sanitizeHtml(paragraphs || `<p>${escaped}</p>`);
};

const computePreview = (raw: string): string => {
  const compact = raw.replace(/\s+/g, ' ').trim();
  return compact.slice(0, 160);
};

const normalizeFeedEntry = (entry: RawFeedEntry): JournalFeedEntry => {
  const timestamp = entry.ts || entry.created_at || new Date().toISOString();
  const type = entry.type === 'voice' || entry.type === 'text' ? entry.type : (entry.summary || entry.summary_120 ? 'voice' : 'text');
  const baseText = entry.preview || entry.summary || entry.summary_120 || entry.text_raw || '';
  const sanitizedText = DataValidator.sanitizeHtml(baseText);
  const plainText = stripHtml(sanitizedText);
  const tags = extractTags(entry.text_raw ?? entry.preview ?? entry.summary, [
    ...(entry.tags ?? []),
    ...(entry.tag_set ?? []),
    ...((entry.meta?.tags ?? []) as string[]),
  ]);

  return {
    id: entry.id,
    type,
    timestamp,
    text: plainText,
    summary: entry.summary || entry.summary_120,
    tags,
    valence: entry.valence,
    mood: deriveMood(entry.valence),
    origin: 'remote',
  };
};

export async function fetchJournalFeed(): Promise<JournalFeedEntry[]> {
  const response = await httpClient.get<JournalFeedResponse>('api/v1/me/journal');
  const payload = response.data;
  if (!payload?.ok) {
    throw new Error('Impossible de récupérer le journal');
  }
  const entries = payload.data?.entries ?? [];
  return entries.filter((entry): entry is RawFeedEntry & { id: string } => Boolean(entry?.id)).map(normalizeFeedEntry);
}

type CreateTextPayload = {
  content: string;
  tags?: string[];
};

export async function createJournalTextEntry({ content, tags = [] }: CreateTextPayload) {
  const sanitizedRaw = sanitizePlain(DataValidator.validateAndSanitize(secureTextSchema, content));
  const normalizedTags = Array.from(new Set(tags.map(normalizeTag).filter(Boolean)));
  const appendedTags = normalizedTags.length
    ? `${sanitizedRaw}\n\n${normalizedTags.map(tag => `#${tag}`).join(' ')}`
    : sanitizedRaw;

  const valence = 0;
  const html = buildHtml(appendedTags);
  const preview = computePreview(appendedTags);

  const payload = {
    text_raw: appendedTags,
    styled_html: html,
    preview,
    valence,
    emo_vec: buildEmotionVector(valence),
  };

  const response = await httpClient.post<CreateEntryResponse>('api/v1/journal/text', payload);
  if (!response.data?.ok) {
    throw new Error(response.data?.['error']?.['message'] ?? 'Enregistrement impossible');
  }
  return response.data.data;
}

export function mapLocalEntry(entry: {
  id: string;
  createdAt: string;
  content: string;
  tags?: string[];
}): JournalFeedEntry {
  const tags = extractTags(entry.content, entry.tags ?? []);
  return {
    id: entry.id,
    type: 'text',
    timestamp: entry.createdAt,
    text: entry.content,
    tags,
    origin: 'local',
  };
}

