// @ts-nocheck
/**
 * Export Utils - Utilitaires d'export complets
 * Téléchargement, conversion de fichiers et formatage
 */

import { logger } from '@/lib/logger';

/** Format d'export */
export type ExportFormat = 'json' | 'csv' | 'pdf' | 'xlsx' | 'txt' | 'html' | 'xml' | 'md';

/** Type MIME */
export type MimeType =
  | 'application/json'
  | 'text/csv'
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'text/plain'
  | 'text/html'
  | 'application/xml'
  | 'text/markdown';

/** Options d'export */
export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeHeaders?: boolean;
  delimiter?: string;
  encoding?: string;
  prettify?: boolean;
  metadata?: ExportMetadata;
}

/** Métadonnées d'export */
export interface ExportMetadata {
  title?: string;
  author?: string;
  created?: Date;
  description?: string;
  version?: string;
  source?: string;
}

/** Résultat d'export */
export interface ExportResult {
  success: boolean;
  filename: string;
  size: number;
  format: ExportFormat;
  duration: number;
  error?: string;
}

/** Stats d'export */
export interface ExportStats {
  totalExports: number;
  successfulExports: number;
  failedExports: number;
  byFormat: Record<ExportFormat, number>;
  totalBytesExported: number;
}

// Configuration
const MIME_TYPES: Record<ExportFormat, MimeType> = {
  json: 'application/json',
  csv: 'text/csv',
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  txt: 'text/plain',
  html: 'text/html',
  xml: 'application/xml',
  md: 'text/markdown'
};

const FILE_EXTENSIONS: Record<ExportFormat, string> = {
  json: '.json',
  csv: '.csv',
  pdf: '.pdf',
  xlsx: '.xlsx',
  txt: '.txt',
  html: '.html',
  xml: '.xml',
  md: '.md'
};

// Stats globales
const stats: ExportStats = {
  totalExports: 0,
  successfulExports: 0,
  failedExports: 0,
  byFormat: {
    json: 0,
    csv: 0,
    pdf: 0,
    xlsx: 0,
    txt: 0,
    html: 0,
    xml: 0,
    md: 0
  },
  totalBytesExported: 0
};

/** Déclencher un téléchargement */
export function triggerDownload(fileName: string, dataUrl: string): void {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  logger.debug('Download triggered', { fileName }, 'EXPORT');
}

/** Télécharger un Blob */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  triggerDownload(filename, url);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/** Télécharger du contenu texte */
export function downloadText(content: string, filename: string, mimeType: MimeType = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
}

/** Nettoyer un nom de fichier */
export function sanitizeFileName(value: string): string {
  return value
    .replace(/[^a-z0-9-_.\s]/gi, '-')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 200);
}

/** Générer un nom de fichier avec timestamp */
export function generateFileName(baseName: string, format: ExportFormat): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const sanitized = sanitizeFileName(baseName);
  return `${sanitized}_${timestamp}${FILE_EXTENSIONS[format]}`;
}

/** Convertir des données en JSON */
export function toJSON(data: unknown, prettify: boolean = true): string {
  return prettify
    ? JSON.stringify(data, null, 2)
    : JSON.stringify(data);
}

/** Convertir un tableau en CSV */
export function toCSV(
  data: Record<string, unknown>[],
  options: {
    delimiter?: string;
    includeHeaders?: boolean;
    nullValue?: string;
  } = {}
): string {
  if (data.length === 0) return '';

  const delimiter = options.delimiter ?? ',';
  const includeHeaders = options.includeHeaders ?? true;
  const nullValue = options.nullValue ?? '';

  const headers = Object.keys(data[0]);
  const rows: string[] = [];

  if (includeHeaders) {
    rows.push(headers.map(h => escapeCSVField(h, delimiter)).join(delimiter));
  }

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return nullValue;
      return escapeCSVField(String(value), delimiter);
    });
    rows.push(values.join(delimiter));
  }

  return rows.join('\n');
}

/** Échapper un champ CSV */
function escapeCSVField(field: string, delimiter: string): string {
  const needsEscaping = field.includes('"') || field.includes(delimiter) || field.includes('\n');
  if (needsEscaping) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/** Parser du CSV */
export function parseCSV(
  csv: string,
  options: { delimiter?: string; hasHeaders?: boolean } = {}
): Record<string, string>[] {
  const delimiter = options.delimiter ?? ',';
  const hasHeaders = options.hasHeaders ?? true;

  const lines = csv.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = hasHeaders
    ? parseCSVLine(lines[0], delimiter)
    : lines[0].split(delimiter).map((_, i) => `col${i}`);

  const dataLines = hasHeaders ? lines.slice(1) : lines;

  return dataLines.map(line => {
    const values = parseCSVLine(line, delimiter);
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] ?? '';
    });
    return obj;
  });
}

/** Parser une ligne CSV */
function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/** Convertir en XML */
export function toXML(
  data: unknown,
  rootName: string = 'root',
  options: { indent?: number; declaration?: boolean } = {}
): string {
  const indent = options.indent ?? 2;
  const declaration = options.declaration ?? true;

  let xml = declaration ? '<?xml version="1.0" encoding="UTF-8"?>\n' : '';
  xml += objectToXML(data, rootName, 0, indent);

  return xml;
}

/** Convertir un objet en XML */
function objectToXML(obj: unknown, tagName: string, level: number, indent: number): string {
  const padding = ' '.repeat(level * indent);

  if (obj === null || obj === undefined) {
    return `${padding}<${tagName}/>\n`;
  }

  if (typeof obj !== 'object') {
    return `${padding}<${tagName}>${escapeXML(String(obj))}</${tagName}>\n`;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => objectToXML(item, tagName, level, indent)).join('');
  }

  const entries = Object.entries(obj as Record<string, unknown>);
  if (entries.length === 0) {
    return `${padding}<${tagName}/>\n`;
  }

  let xml = `${padding}<${tagName}>\n`;
  for (const [key, value] of entries) {
    xml += objectToXML(value, key, level + 1, indent);
  }
  xml += `${padding}</${tagName}>\n`;

  return xml;
}

/** Échapper les caractères XML */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Convertir en Markdown */
export function toMarkdown(
  data: Record<string, unknown>[],
  options: { title?: string; includeDate?: boolean } = {}
): string {
  if (data.length === 0) return '';

  let md = '';

  if (options.title) {
    md += `# ${options.title}\n\n`;
  }

  if (options.includeDate) {
    md += `*Généré le ${new Date().toLocaleString('fr-FR')}*\n\n`;
  }

  const headers = Object.keys(data[0]);

  // Table header
  md += '| ' + headers.join(' | ') + ' |\n';
  md += '| ' + headers.map(() => '---').join(' | ') + ' |\n';

  // Table rows
  for (const row of data) {
    const values = headers.map(h => {
      const v = row[h];
      return v !== null && v !== undefined ? String(v) : '';
    });
    md += '| ' + values.join(' | ') + ' |\n';
  }

  return md;
}

/** Convertir en HTML */
export function toHTML(
  data: Record<string, unknown>[],
  options: { title?: string; styles?: boolean } = {}
): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const title = options.title ?? 'Export';

  let html = '<!DOCTYPE html>\n<html lang="fr">\n<head>\n';
  html += `  <meta charset="UTF-8">\n`;
  html += `  <title>${escapeHTML(title)}</title>\n`;

  if (options.styles !== false) {
    html += `  <style>
    body { font-family: sans-serif; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f5f5f5; }
    tr:nth-child(even) { background-color: #fafafa; }
  </style>\n`;
  }

  html += '</head>\n<body>\n';
  html += `  <h1>${escapeHTML(title)}</h1>\n`;
  html += '  <table>\n    <thead>\n      <tr>\n';

  for (const header of headers) {
    html += `        <th>${escapeHTML(header)}</th>\n`;
  }

  html += '      </tr>\n    </thead>\n    <tbody>\n';

  for (const row of data) {
    html += '      <tr>\n';
    for (const header of headers) {
      const value = row[header];
      const displayValue = value !== null && value !== undefined ? String(value) : '';
      html += `        <td>${escapeHTML(displayValue)}</td>\n`;
    }
    html += '      </tr>\n';
  }

  html += '    </tbody>\n  </table>\n</body>\n</html>';

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

/** Exporter des données */
export async function exportData(
  data: unknown,
  options: ExportOptions
): Promise<ExportResult> {
  const startTime = performance.now();
  const format = options.format;
  const filename = options.filename ?? generateFileName('export', format);

  stats.totalExports++;
  stats.byFormat[format]++;

  try {
    let content: string;
    let mimeType: MimeType = MIME_TYPES[format];

    switch (format) {
      case 'json':
        content = toJSON(data, options.prettify ?? true);
        break;

      case 'csv':
        if (!Array.isArray(data)) {
          throw new Error('CSV export requires an array of objects');
        }
        content = toCSV(data as Record<string, unknown>[], {
          delimiter: options.delimiter,
          includeHeaders: options.includeHeaders ?? true
        });
        break;

      case 'xml':
        content = toXML(data, 'export', { indent: 2 });
        break;

      case 'md':
        if (!Array.isArray(data)) {
          throw new Error('Markdown export requires an array of objects');
        }
        content = toMarkdown(data as Record<string, unknown>[], {
          title: options.metadata?.title
        });
        break;

      case 'html':
        if (!Array.isArray(data)) {
          throw new Error('HTML export requires an array of objects');
        }
        content = toHTML(data as Record<string, unknown>[], {
          title: options.metadata?.title
        });
        break;

      case 'txt':
        content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        break;

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    const blob = new Blob([content], { type: mimeType });
    downloadBlob(blob, filename);

    const duration = performance.now() - startTime;
    stats.successfulExports++;
    stats.totalBytesExported += blob.size;

    logger.info('Export successful', { filename, format, size: blob.size, duration }, 'EXPORT');

    return {
      success: true,
      filename,
      size: blob.size,
      format,
      duration
    };
  } catch (error) {
    stats.failedExports++;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    logger.error('Export failed', error as Error, 'EXPORT');

    return {
      success: false,
      filename,
      size: 0,
      format,
      duration: performance.now() - startTime,
      error: errorMessage
    };
  }
}

/** Créer un Data URL depuis un contenu */
export function createDataUrl(content: string, mimeType: MimeType): string {
  const base64 = btoa(unescape(encodeURIComponent(content)));
  return `data:${mimeType};base64,${base64}`;
}

/** Obtenir la taille formatée */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}

/** Obtenir l'extension d'un format */
export function getFileExtension(format: ExportFormat): string {
  return FILE_EXTENSIONS[format];
}

/** Obtenir le type MIME d'un format */
export function getMimeType(format: ExportFormat): MimeType {
  return MIME_TYPES[format];
}

/** Obtenir les stats d'export */
export function getExportStats(): ExportStats {
  return { ...stats };
}

/** Réinitialiser les stats */
export function resetExportStats(): void {
  stats.totalExports = 0;
  stats.successfulExports = 0;
  stats.failedExports = 0;
  stats.totalBytesExported = 0;
  Object.keys(stats.byFormat).forEach(k => {
    stats.byFormat[k as ExportFormat] = 0;
  });
}

/** Vérifier le support d'un format */
export function isFormatSupported(format: ExportFormat): boolean {
  return format in MIME_TYPES;
}

/** Obtenir tous les formats supportés */
export function getSupportedFormats(): ExportFormat[] {
  return Object.keys(MIME_TYPES) as ExportFormat[];
}

export default {
  triggerDownload,
  downloadBlob,
  downloadText,
  sanitizeFileName,
  generateFileName,
  toJSON,
  toCSV,
  parseCSV,
  toXML,
  toMarkdown,
  toHTML,
  exportData,
  createDataUrl,
  formatFileSize,
  getFileExtension,
  getMimeType,
  getExportStats,
  resetExportStats,
  isFormatSupported,
  getSupportedFormats
};
