// @ts-nocheck
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ParcoursRun, ParcoursSegment } from '@/types/music/parcours';
import { logger } from '@/lib/logger';

export function useParcoursGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const createRun = useCallback(async (
    presetKey: string,
    emotionState?: string
  ): Promise<{ run: ParcoursRun; segments: ParcoursSegment[] } | null> => {
    setIsGenerating(true);
    setError(null);
    setGenerationProgress(10);

    try {
      // Create the run via Edge Function
      const { data, error: createError } = await supabase.functions.invoke(
        'parcours-xl-create',
        {
          body: { presetKey, emotionState },
        }
      );

      if (createError) throw createError;
      if (!data?.runId) throw new Error('No runId returned');

      setGenerationProgress(30);

      // Poll for segments to be ready
      const runId = data.runId;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s

        // Fetch run and segments
        const { data: run, error: runError } = await supabase
          .from('parcours_runs')
          .select('*')
          .eq('id', runId)
          .single();

        if (runError) throw runError;

        const { data: segments, error: segError } = await supabase
          .from('parcours_segments')
          .select('*')
          .eq('run_id', runId)
          .order('segment_index');

        if (segError) throw segError;

        // Check if all segments have at least preview_url (first) or final_url (complete)
        const readySegments = segments.filter(s => s.preview_url || s.final_url || s.storage_path);
        const progress = 30 + (readySegments.length / segments.length) * 60;
        setGenerationProgress(Math.round(progress));

        if (run.status === 'ready' || readySegments.length === segments.length) {
          setGenerationProgress(100);
          setIsGenerating(false);
          return { run, segments };
        }

        if (run.status === 'failed') {
          throw new Error('Parcours generation failed');
        }

        attempts++;
      }

      throw new Error('Generation timeout - please try again');

    } catch (err: any) {
      logger.error('Parcours generation error', err as Error, 'MUSIC');
      setError(err.message || 'Failed to generate parcours');
      setIsGenerating(false);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setGenerationProgress(0);
    setError(null);
  }, []);

  return {
    isGenerating,
    generationProgress,
    error,
    createRun,
    reset,
  };
}
