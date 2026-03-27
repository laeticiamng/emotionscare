// @ts-nocheck
import { logger } from '@/lib/logger';

export async function exportNodeToPng(node: HTMLElement, filename: string) {
  if (!node) {
    throw new Error('export_target_missing');
  }

  const normalizedFilename = filename.toLowerCase().endsWith('.png') ? filename : `${filename}.png`;

  try {
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(node, {
      backgroundColor: '#ffffff',
      scale: Math.min(2, Math.max(1, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)),
      useCORS: true,
      logging: false,
    });

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = normalizedFilename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    logger.error('Export failed', error as Error, 'SYSTEM');
    throw (error instanceof Error ? error : new Error('png_export_failed'));
  }
}
