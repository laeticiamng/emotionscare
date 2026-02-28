import { describe, it, expect } from 'vitest';

/**
 * Test CI : vérifie qu'aucune clé privée n'est exposée côté client
 * via les variables d'environnement VITE_*.
 */

const FORBIDDEN_PATTERNS = [
  'SERVICE_ROLE',
  'SECRET_KEY',
  'PRIVATE_KEY',
  'OPENAI_API_KEY',
  'HUME_API_KEY',
  'SUNO_API_KEY',
  'STRIPE_SECRET',
];

describe('No secrets in bundle', () => {
  it('should not expose sensitive keys via VITE_ env vars', () => {
    const envKeys = Object.keys(import.meta.env).filter((k) => k.startsWith('VITE_'));

    for (const envKey of envKeys) {
      for (const pattern of FORBIDDEN_PATTERNS) {
        expect(envKey.toUpperCase()).not.toContain(pattern);
      }
    }
  });

  it('should not have sensitive values in VITE_ env vars', () => {
    const envEntries = Object.entries(import.meta.env).filter(([k]) => k.startsWith('VITE_'));

    for (const [key, value] of envEntries) {
      if (typeof value !== 'string') continue;
      // Service role keys start with eyJ and are long
      expect(value.length).toBeLessThan(500);
    }
  });
});
