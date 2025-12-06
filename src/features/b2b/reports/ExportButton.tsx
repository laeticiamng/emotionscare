import React from 'react';
import { captureException } from '@/lib/ai-monitoring';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportNodeToPng } from '@/features/export/exportPng';
import { logger } from '@/lib/logger';

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLElement>;
  fileName?: string;
  className?: string;
}

export function ExportButton({ targetRef, fileName = 'heatmap.png', className }: ExportButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    if (!targetRef.current || isExporting) {
      return;
    }
    setIsExporting(true);
    logger.debug('Export PNG triggered', { fileName }, 'B2B_EXPORT');
    try {
      await exportNodeToPng(targetRef.current, fileName);
    } catch (error) {
      logger.error('[b2b-export] PNG export failed', error as Error, 'B2B_EXPORT');
      captureException(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleExport}
      disabled={isExporting || !targetRef.current}
    >
      <Download className="mr-2 h-4 w-4" aria-hidden="true" />
      {isExporting ? 'Export en cours…' : 'Exporter en PNG'}
    </Button>
  );
}
