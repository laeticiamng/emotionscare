import { useCallback, useState } from 'react';
import type { RefObject } from 'react';
import * as Sentry from '@sentry/react';
import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { exportSvgToPng } from '@/lib/export/svgExport';

export interface ExportButtonProps {
  targetRef: RefObject<HTMLElement | null>;
  fileName: string;
  label: string;
  className?: string;
  onError?: (message: string) => void;
  onStart?: () => void;
}

export function ExportButton({ targetRef, fileName, label, className, onError, onStart }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    const container = targetRef.current;
    if (!container) {
      onError?.("Aucun contenu à exporter");
      return;
    }

    const svg = container.querySelector('svg');
    if (!svg || !(svg instanceof SVGSVGElement)) {
      onError?.('Le graphique ne contient pas de rendu SVG exportable.');
      return;
    }

    try {
      setIsExporting(true);
      onStart?.();
      Sentry.addBreadcrumb({
        category: 'scores',
        message: 'scores:export:png',
        data: { fileName },
        level: 'info',
      });
      await exportSvgToPng(svg, {
        fileName,
        backgroundColor: '#ffffff',
        padding: 24,
        scale: Math.min(3, Math.max(1, window.devicePixelRatio || 1)),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export PNG impossible.';
      onError?.(message);
    } finally {
      setIsExporting(false);
    }
  }, [fileName, onError, onStart, targetRef]);

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleExport}
      disabled={isExporting}
      className={className}
      aria-busy={isExporting}
    >
      <Download className="mr-2 h-4 w-4" aria-hidden="true" />
      {isExporting ? 'Export...' : label}
    </Button>
  );
}

export default ExportButton;
