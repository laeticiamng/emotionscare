export function sanitizeAggregateText(text: string): string {
  return text
    .replace(/\d+(?:[.,]\d+)?\s*%?/g, '')
    .replace(/\b(score|niveau|points?)\b/gi, '')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\/\s*(?=\()/g, '/ ')
    .replace(/\s+/g, ' ')
    .trim();
}
