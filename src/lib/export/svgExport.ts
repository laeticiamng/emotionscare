import { sanitizeFileName, triggerDownload } from './utils';

export interface SvgExportOptions {
  fileName?: string;
  backgroundColor?: string;
  padding?: number;
  scale?: number;
}

export async function exportSvgToPng(svg: SVGSVGElement, options: SvgExportOptions = {}): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error("L'export PNG est uniquement disponible dans le navigateur.");
  }

  const { fileName = 'chart', backgroundColor = '#ffffff', padding = 24, scale = 2 } = options;

  const cloned = svg.cloneNode(true) as SVGSVGElement;
  cloned.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const boundingRect = svg.getBoundingClientRect();
  const viewBox = svg.viewBox?.baseVal;

  let width = Number.parseFloat(svg.getAttribute('width') ?? '') || boundingRect.width;
  let height = Number.parseFloat(svg.getAttribute('height') ?? '') || boundingRect.height;

  if ((!width || !height) && viewBox) {
    width = viewBox.width;
    height = viewBox.height;
  }

  if (!width || !height) {
    throw new Error('Impossible de déterminer la taille du graphique.');
  }

  const normalizedViewBox = svg.getAttribute('viewBox') ?? `0 0 ${width} ${height}`;
  cloned.setAttribute('width', `${width}`);
  cloned.setAttribute('height', `${height}`);
  cloned.setAttribute('viewBox', normalizedViewBox);

  const serialized = new XMLSerializer().serializeToString(cloned);
  const svgBlob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>${serialized}`], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(svgBlob);

  const exportScale = Math.max(1, scale);
  const scaledWidth = width * exportScale;
  const scaledHeight = height * exportScale;

  try {
    const image = await loadImage(url, scaledWidth, scaledHeight);
    const canvas = document.createElement('canvas');
    const paddingValue = Math.max(0, padding);

    canvas.width = Math.round(scaledWidth + paddingValue * 2);
    canvas.height = Math.round(scaledHeight + paddingValue * 2);

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Impossible de créer un contexte canvas.');
    }

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, paddingValue, paddingValue, scaledWidth, scaledHeight);

    const dataUrl = canvas.toDataURL('image/png');
    triggerDownload(`${sanitizeFileName(fileName)}.png`, dataUrl);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(url: string, width: number, height: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = async () => {
      try {
        if ('decode' in image) {
          await image.decode();
        }
        image.width = width;
        image.height = height;
        resolve(image);
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = () => {
      reject(new Error('Impossible de charger le graphique pour export.'));
    };
    image.src = url;
  });
}

