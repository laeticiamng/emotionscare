import html2canvas from 'html2canvas';

import { sanitizeFileName, triggerDownload } from './utils';

export interface DomExportOptions {
  fileName?: string;
  backgroundColor?: string;
  padding?: number;
  scale?: number;
}

export async function exportElementToPng(element: HTMLElement, options: DomExportOptions = {}): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error("L'export PNG est uniquement disponible dans le navigateur.");
  }

  const {
    fileName = 'chart',
    backgroundColor = '#ffffff',
    padding = 24,
    scale = window.devicePixelRatio || 1,
  } = options;

  const captureScale = Math.min(3, Math.max(1, scale));

  const canvas = await html2canvas(element, {
    backgroundColor,
    scale: captureScale,
    logging: false,
    useCORS: true,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  if (!canvas) {
    throw new Error('Impossible de capturer cette vue.');
  }

  const paddingValue = Math.max(0, padding);
  let exportCanvas = canvas;

  if (paddingValue > 0) {
    const paddedCanvas = document.createElement('canvas');
    paddedCanvas.width = canvas.width + paddingValue * 2;
    paddedCanvas.height = canvas.height + paddingValue * 2;

    const context = paddedCanvas.getContext('2d');
    if (!context) {
      throw new Error('Impossible de préparer le rendu PNG.');
    }

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
    context.drawImage(canvas, paddingValue, paddingValue);

    exportCanvas = paddedCanvas;
  }

  const dataUrl = exportCanvas.toDataURL('image/png', 0.92);
  triggerDownload(`${sanitizeFileName(fileName)}.png`, dataUrl);
}

