// @ts-nocheck
import { useCallback, useState } from 'react';
import type { RefObject } from 'react';
import { exportElementToPng, type DomExportOptions } from '@/lib/export/domExport';
import { logger } from '@/lib/logger';

export interface ChartExportOptions extends DomExportOptions {}

export function useChartExporter(defaultOptions?: ChartExportOptions) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToPng = useCallback(
    async (target: RefObject<HTMLElement | null>, options?: ChartExportOptions) => {
      const element = target.current;
      if (!element) {
        setError('Aucun graphique à exporter.');
        return;
      }

      try {
        setIsExporting(true);
        setError(null);
        await exportElementToPng(element, { ...defaultOptions, ...options });
      } catch (exportError) {
        logger.error('Chart export failed', exportError as Error, 'UI');
        setError(exportError instanceof Error ? exportError.message : 'Export impossible.');
      } finally {
        setIsExporting(false);
      }
    },
    [defaultOptions],
  );

  const resetError = useCallback(() => setError(null), []);

  return { exportToPng, isExporting, error, resetError };
}

