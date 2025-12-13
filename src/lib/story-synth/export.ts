// @ts-nocheck
/**
 * Story Synth Export - Utilitaires d'export complets pour les histoires
 * Export multi-format avec métadonnées, formatage et téléchargement
 */

import { logger } from '@/lib/logger';

/** Format d'export de story */
export type StoryExportFormat = 'txt' | 'md' | 'html' | 'json' | 'pdf' | 'epub' | 'docx';

/** Métadonnées de story */
export interface StoryMetadata {
  title?: string;
  author?: string;
  date?: Date;
  description?: string;
  tags?: string[];
  genre?: string;
  wordCount?: number;
  readingTime?: number;
  language?: string;
}

/** Options d'export */
export interface StoryExportOptions {
  format: StoryExportFormat;
  includeMetadata?: boolean;
  includeTimestamp?: boolean;
  includeLineNumbers?: boolean;
  paragraphSeparator?: string;
  encoding?: string;
  styles?: StoryStyles;
}

/** Styles pour l'export */
export interface StoryStyles {
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  margins?: string;
  headerStyle?: string;
  paragraphStyle?: string;
}

/** Résultat d'export */
export interface ExportResult {
  success: boolean;
  filename: string;
  format: StoryExportFormat;
  size: number;
  duration: number;
  error?: string;
}

/** Stats d'export */
export interface ExportStats {
  totalExports: number;
  byFormat: Record<StoryExportFormat, number>;
  totalWords: number;
  averageLength: number;
}

// Styles par défaut
const DEFAULT_STYLES: StoryStyles = {
  fontFamily: 'Georgia, serif',
  fontSize: '16px',
  lineHeight: '1.8',
  textAlign: 'justify',
  margins: '2em',
  headerStyle: 'font-size: 2em; text-align: center; margin-bottom: 1em;',
  paragraphStyle: 'text-indent: 2em; margin-bottom: 1em;'
};

// Stats globales
const stats: ExportStats = {
  totalExports: 0,
  byFormat: {
    txt: 0,
    md: 0,
    html: 0,
    json: 0,
    pdf: 0,
    epub: 0,
    docx: 0
  },
  totalWords: 0,
  averageLength: 0
};

/** Compter les mots */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/** Calculer le temps de lecture (mots par minute) */
export function calculateReadingTime(wordCount: number, wpm: number = 200): number {
  return Math.ceil(wordCount / wpm);
}

/** Nettoyer un nom de fichier */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9-_.À-ÿ\s]/gi, '-')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 200);
}

/** Générer un nom de fichier avec timestamp */
export function generateFilename(
  baseName: string,
  format: StoryExportFormat,
  includeTimestamp: boolean = true
): string {
  const sanitized = sanitizeFilename(baseName || 'story');
  const timestamp = includeTimestamp
    ? `_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`
    : '';
  const extension = format === 'txt' ? '.txt' : `.${format}`;
  return `${sanitized}${timestamp}${extension}`;
}

/** Télécharger du texte */
export function downloadText(filename: string, paragraphs: string[]): void {
  const content = paragraphs.join("\n\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, filename);
}

/** Télécharger un Blob */
export function downloadBlob(blob: Blob, filename: string): void {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 100);
}

/** Convertir en texte brut */
export function toPlainText(
  paragraphs: string[],
  metadata?: StoryMetadata,
  options?: { includeMetadata?: boolean; lineNumbers?: boolean }
): string {
  let output = '';

  if (options?.includeMetadata && metadata) {
    if (metadata.title) output += `${metadata.title}\n${'='.repeat(metadata.title.length)}\n\n`;
    if (metadata.author) output += `Par: ${metadata.author}\n`;
    if (metadata.date) output += `Date: ${metadata.date.toLocaleDateString('fr-FR')}\n`;
    if (metadata.description) output += `\n${metadata.description}\n`;
    output += '\n---\n\n';
  }

  if (options?.lineNumbers) {
    output += paragraphs
      .map((p, i) => `${(i + 1).toString().padStart(3, ' ')}. ${p}`)
      .join('\n\n');
  } else {
    output += paragraphs.join('\n\n');
  }

  if (options?.includeMetadata && metadata?.wordCount) {
    output += `\n\n---\nMots: ${metadata.wordCount}`;
    if (metadata.readingTime) {
      output += ` | Temps de lecture: ~${metadata.readingTime} min`;
    }
  }

  return output;
}

/** Convertir en Markdown */
export function toMarkdown(
  paragraphs: string[],
  metadata?: StoryMetadata,
  options?: { includeMetadata?: boolean }
): string {
  let md = '';

  if (options?.includeMetadata && metadata) {
    // YAML front matter
    md += '---\n';
    if (metadata.title) md += `title: "${metadata.title}"\n`;
    if (metadata.author) md += `author: "${metadata.author}"\n`;
    if (metadata.date) md += `date: ${metadata.date.toISOString().split('T')[0]}\n`;
    if (metadata.tags?.length) md += `tags: [${metadata.tags.map(t => `"${t}"`).join(', ')}]\n`;
    if (metadata.genre) md += `genre: "${metadata.genre}"\n`;
    if (metadata.language) md += `language: "${metadata.language}"\n`;
    md += '---\n\n';

    if (metadata.title) md += `# ${metadata.title}\n\n`;
    if (metadata.description) md += `*${metadata.description}*\n\n`;
  }

  md += paragraphs.join('\n\n');

  if (options?.includeMetadata && metadata?.wordCount) {
    md += '\n\n---\n\n';
    md += `**Statistiques:** ${metadata.wordCount} mots`;
    if (metadata.readingTime) {
      md += ` | ~${metadata.readingTime} min de lecture`;
    }
  }

  return md;
}

/** Convertir en HTML */
export function toHTML(
  paragraphs: string[],
  metadata?: StoryMetadata,
  styles?: StoryStyles
): string {
  const s = { ...DEFAULT_STYLES, ...styles };
  const title = metadata?.title || 'Histoire';

  let html = `<!DOCTYPE html>
<html lang="${metadata?.language || 'fr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(title)}</title>
  ${metadata?.author ? `<meta name="author" content="${escapeHTML(metadata.author)}">` : ''}
  ${metadata?.description ? `<meta name="description" content="${escapeHTML(metadata.description)}">` : ''}
  <style>
    body {
      font-family: ${s.fontFamily};
      font-size: ${s.fontSize};
      line-height: ${s.lineHeight};
      max-width: 800px;
      margin: 0 auto;
      padding: ${s.margins};
      background-color: #fafafa;
      color: #333;
    }
    h1 { ${s.headerStyle} }
    .meta {
      text-align: center;
      color: #666;
      margin-bottom: 2em;
      font-style: italic;
    }
    p { ${s.paragraphStyle} text-align: ${s.textAlign}; }
    .separator {
      text-align: center;
      margin: 2em 0;
      color: #999;
    }
    .stats {
      margin-top: 3em;
      padding-top: 1em;
      border-top: 1px solid #ddd;
      font-size: 0.9em;
      color: #666;
    }
    @media print {
      body { max-width: 100%; padding: 1cm; }
    }
  </style>
</head>
<body>
`;

  if (metadata?.title) {
    html += `  <h1>${escapeHTML(metadata.title)}</h1>\n`;
  }

  if (metadata?.author || metadata?.date) {
    html += '  <div class="meta">\n';
    if (metadata.author) html += `    <span>Par ${escapeHTML(metadata.author)}</span>\n`;
    if (metadata.date) html += `    <span> - ${metadata.date.toLocaleDateString('fr-FR')}</span>\n`;
    html += '  </div>\n';
  }

  if (metadata?.description) {
    html += `  <p class="description"><em>${escapeHTML(metadata.description)}</em></p>\n`;
  }

  html += '  <article>\n';
  for (const paragraph of paragraphs) {
    html += `    <p>${escapeHTML(paragraph)}</p>\n`;
  }
  html += '  </article>\n';

  if (metadata?.wordCount) {
    html += '  <div class="stats">\n';
    html += `    <p>📝 ${metadata.wordCount} mots`;
    if (metadata.readingTime) {
      html += ` | ⏱️ ~${metadata.readingTime} min de lecture`;
    }
    html += '</p>\n';
    html += '  </div>\n';
  }

  html += '</body>\n</html>';

  return html;
}

/** Échapper les caractères HTML */
function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Convertir en JSON */
export function toJSON(
  paragraphs: string[],
  metadata?: StoryMetadata
): string {
  const data = {
    metadata: metadata ? {
      ...metadata,
      date: metadata.date?.toISOString()
    } : undefined,
    content: paragraphs,
    stats: {
      paragraphCount: paragraphs.length,
      wordCount: metadata?.wordCount || paragraphs.reduce((sum, p) => sum + countWords(p), 0),
      characterCount: paragraphs.join('').length
    },
    exportedAt: new Date().toISOString()
  };

  return JSON.stringify(data, null, 2);
}

/** Exporter une histoire */
export async function exportStory(
  paragraphs: string[],
  options: StoryExportOptions,
  metadata?: StoryMetadata
): Promise<ExportResult> {
  const startTime = performance.now();
  const format = options.format;

  // Enrichir les métadonnées
  const enrichedMetadata: StoryMetadata = {
    ...metadata,
    wordCount: metadata?.wordCount || paragraphs.reduce((sum, p) => sum + countWords(p), 0),
    readingTime: 0
  };
  enrichedMetadata.readingTime = calculateReadingTime(enrichedMetadata.wordCount!);

  const filename = generateFilename(
    metadata?.title || 'histoire',
    format,
    options.includeTimestamp ?? true
  );

  stats.totalExports++;
  stats.byFormat[format]++;
  stats.totalWords += enrichedMetadata.wordCount!;
  stats.averageLength = stats.totalWords / stats.totalExports;

  try {
    let content: string;
    let mimeType: string;

    switch (format) {
      case 'txt':
        content = toPlainText(paragraphs, enrichedMetadata, {
          includeMetadata: options.includeMetadata,
          lineNumbers: options.includeLineNumbers
        });
        mimeType = 'text/plain;charset=utf-8';
        break;

      case 'md':
        content = toMarkdown(paragraphs, enrichedMetadata, {
          includeMetadata: options.includeMetadata
        });
        mimeType = 'text/markdown;charset=utf-8';
        break;

      case 'html':
        content = toHTML(paragraphs, enrichedMetadata, options.styles);
        mimeType = 'text/html;charset=utf-8';
        break;

      case 'json':
        content = toJSON(paragraphs, enrichedMetadata);
        mimeType = 'application/json;charset=utf-8';
        break;

      default:
        throw new Error(`Format non supporté: ${format}`);
    }

    const blob = new Blob([content], { type: mimeType });
    downloadBlob(blob, filename);

    const duration = performance.now() - startTime;

    logger.info('Story exported', {
      filename,
      format,
      size: blob.size,
      wordCount: enrichedMetadata.wordCount,
      duration
    }, 'STORY');

    return {
      success: true,
      filename,
      format,
      size: blob.size,
      duration
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Story export failed', error as Error, 'STORY');

    return {
      success: false,
      filename,
      format,
      size: 0,
      duration: performance.now() - startTime,
      error: errorMessage
    };
  }
}

/** Export rapide en texte */
export function quickExportText(paragraphs: string[], title?: string): void {
  const filename = generateFilename(title || 'histoire', 'txt', true);
  downloadText(filename, paragraphs);
}

/** Export rapide en Markdown */
export function quickExportMarkdown(
  paragraphs: string[],
  metadata?: StoryMetadata
): void {
  const content = toMarkdown(paragraphs, metadata, { includeMetadata: true });
  const filename = generateFilename(metadata?.title || 'histoire', 'md', true);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  downloadBlob(blob, filename);
}

/** Export rapide en HTML */
export function quickExportHTML(
  paragraphs: string[],
  metadata?: StoryMetadata
): void {
  const content = toHTML(paragraphs, metadata);
  const filename = generateFilename(metadata?.title || 'histoire', 'html', true);
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  downloadBlob(blob, filename);
}

/** Prévisualiser le contenu */
export function preview(
  paragraphs: string[],
  format: StoryExportFormat,
  metadata?: StoryMetadata
): string {
  switch (format) {
    case 'txt':
      return toPlainText(paragraphs, metadata, { includeMetadata: true });
    case 'md':
      return toMarkdown(paragraphs, metadata, { includeMetadata: true });
    case 'html':
      return toHTML(paragraphs, metadata);
    case 'json':
      return toJSON(paragraphs, metadata);
    default:
      return paragraphs.join('\n\n');
  }
}

/** Obtenir les stats d'export */
export function getExportStats(): ExportStats {
  return { ...stats };
}

/** Obtenir les formats supportés */
export function getSupportedFormats(): StoryExportFormat[] {
  return ['txt', 'md', 'html', 'json'];
}

/** Vérifier si un format est supporté */
export function isFormatSupported(format: string): format is StoryExportFormat {
  return ['txt', 'md', 'html', 'json', 'pdf', 'epub', 'docx'].includes(format);
}

/** Créer des métadonnées enrichies */
export function createMetadata(
  title: string,
  paragraphs: string[],
  options?: Partial<StoryMetadata>
): StoryMetadata {
  const wordCount = paragraphs.reduce((sum, p) => sum + countWords(p), 0);

  return {
    title,
    author: options?.author,
    date: options?.date || new Date(),
    description: options?.description,
    tags: options?.tags || [],
    genre: options?.genre,
    wordCount,
    readingTime: calculateReadingTime(wordCount),
    language: options?.language || 'fr'
  };
}

export default {
  downloadText,
  downloadBlob,
  exportStory,
  toPlainText,
  toMarkdown,
  toHTML,
  toJSON,
  quickExportText,
  quickExportMarkdown,
  quickExportHTML,
  preview,
  countWords,
  calculateReadingTime,
  generateFilename,
  sanitizeFilename,
  getExportStats,
  getSupportedFormats,
  isFormatSupported,
  createMetadata
};
