// @ts-nocheck
const SENSITIVE_REGEX = /\b(suicide|me tuer|plus envie de vivre)\b/i;

export function mustBlock(text: string): boolean {
  return SENSITIVE_REGEX.test(text);
}

export function moderateOutput(output: string): string {
  if (/\d/.test(output)) {
    return 'Respire doucement. Observe, laisse passer.';
  }

  return output.trim().slice(0, 120);
}
