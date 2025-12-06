import React from 'react';
import * as Sentry from '@sentry/react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportNodeToPng } from '@/features/export/exportPng';

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
    Sentry.addBreadcrumb({ category: 'b2b:export:png', message: 'trigger', level: 'info' });
    try {
      await exportNodeToPng(targetRef.current, fileName);
    } catch (error) {
      Sentry.addBreadcrumb({ category: 'b2b:export:png', message: 'error', level: 'error' });
      console.error('[b2b-export] PNG export failed', error);
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
