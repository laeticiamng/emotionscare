// @ts-nocheck
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_PATTERN = /\b(?:\+?\d[\d\s\-]{7,}\d)\b/g;
const MULTI_SPACE = /\s+/g;

export function redactForTelemetry(input: string, limit = 180): string {
  if (!input) return '';
  const trimmed = input.replace(EMAIL_PATTERN, '[email]').replace(PHONE_PATTERN, '[tel]');
  const collapsed = trimmed.replace(MULTI_SPACE, ' ').trim();
  if (collapsed.length <= limit) return collapsed;
  return `${collapsed.slice(0, limit - 1)}…`;
}

export function chunkForStreaming(text: string, size = 96): string[] {
  if (!text) return [];
  const chunks: string[] = [];
  let buffer = '';
  const sentences = text.split(/(?<=[.!?])\s+/);

  for (const sentence of sentences) {
    const candidate = sentence.trim();
    if (!candidate) continue;
    if ((buffer + ' ' + candidate).trim().length <= size) {
      buffer = (buffer + ' ' + candidate).trim();
    } else {
      if (buffer) {
        chunks.push(buffer);
        buffer = '';
      }
      if (candidate.length <= size) {
        chunks.push(candidate);
      } else {
        for (let index = 0; index < candidate.length; index += size) {
          chunks.push(candidate.slice(index, index + size));
        }
      }
    }
  }

  if (buffer) {
    chunks.push(buffer);
  }

  return chunks;
}
