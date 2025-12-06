// @ts-nocheck
const BLOCK_PATTERNS = [
  /ignore (?:all )?previous instructions/i,
  /dis?able safety/i,
  /jailbreak/i,
  /system prompt/i,
];

export function sanitizeUserText(input: string): string {
  const trimmed = input.slice(0, 2000);
  return BLOCK_PATTERNS.reduce((acc, pattern) => acc.replace(pattern, '[redacted]'), trimmed);
}
