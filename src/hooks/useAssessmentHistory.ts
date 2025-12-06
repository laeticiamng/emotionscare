// @ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { supabase } from '@/integrations/supabase/client';
import type { InstrumentCode } from '@/hooks/useAssessment';

const historyEntrySchema = z.object({
  submitted_at: z.string().optional(),
  ts: z.string().optional(),
  score_json: z.object({
    summary: z.string(),
    level: z.number().int().min(0).max(4),
    instrument_version: z.string().optional(),
    generated_at: z.string().optional(),
  }),
});

export interface AssessmentHistoryEntry {
  timestamp: string;
  summary: string;
  level: number;
  version?: string;
}

const fetchHistory = async (instrument: InstrumentCode, limit: number): Promise<AssessmentHistoryEntry[]> => {
  const { data, error } = await supabase
    .from('assessments')
    .select('submitted_at, ts, score_json')
    .eq('instrument', instrument)
    .order('submitted_at', { ascending: false, nullsFirst: false })
    .order('ts', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  const parsed = z.array(historyEntrySchema).safeParse(data ?? []);
  if (!parsed.success) {
    throw new Error('invalid_history_payload');
  }

  return parsed.data.map((entry) => ({
    timestamp:
      entry.score_json.generated_at ??
      entry.submitted_at ??
      entry.ts ??
      new Date().toISOString(),
    summary: entry.score_json.summary,
    level: entry.score_json.level,
    version: entry.score_json.instrument_version ?? undefined,
  }));
};

interface UseAssessmentHistoryOptions {
  limit?: number;
  enabled?: boolean;
}

export const useAssessmentHistory = (
  instrument: InstrumentCode,
  options: UseAssessmentHistoryOptions = {},
) => {
  const limit = options.limit ?? 10;

  return useQuery<AssessmentHistoryEntry[]>({
    queryKey: ['assessment-history', instrument, limit],
    queryFn: () => fetchHistory(instrument, limit),
    enabled: options.enabled !== undefined ? options.enabled : true,
  });
};
