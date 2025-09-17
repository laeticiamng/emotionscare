import { useCallback, useState } from 'react';
import type { RefObject } from 'react';
import { exportSvgToPng, type SvgExportOptions } from '@/lib/export/svgExport';

export interface ChartExportOptions extends SvgExportOptions {}

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

      const svg = element.querySelector('svg');
      if (!svg || !(svg instanceof SVGSVGElement)) {
        setError('Le graphique sélectionné ne contient pas de rendu SVG exportable.');
        return;
      }

      try {
        setIsExporting(true);
        setError(null);
        await exportSvgToPng(svg, { ...defaultOptions, ...options });
      } catch (exportError) {
        console.error('Chart export failed', exportError);
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

