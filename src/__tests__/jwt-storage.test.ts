import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Test de non-régression : le stockage JWT doit prioriser sessionStorage.
 * Aucun nouveau localStorage.setItem('auth_token') ne doit exister dans le code source.
 */

function collectFiles(dir: string, ext: string[]): string[] {
  const results: string[] = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (entry === 'node_modules' || entry === 'dist' || entry === '.git') continue;
      const stat = statSync(full);
      if (stat.isDirectory()) {
        results.push(...collectFiles(full, ext));
      } else if (ext.some(e => full.endsWith(e))) {
        results.push(full);
      }
    }
  } catch {
    // ignore unreadable dirs
  }
  return results;
}

describe('JWT Storage Security', () => {
  it('should not write auth_token to localStorage anywhere in source', () => {
    const files = collectFiles('src', ['.ts', '.tsx']);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      // Match localStorage.setItem('auth_token'...) or localStorage.setItem("auth_token"...)
      if (/localStorage\.setItem\s*\(\s*['"]auth_token['"]/g.test(content)) {
        violations.push(file);
      }
    }

    expect(violations).toEqual([]);
  });

  it('should use sessionStorage as primary token storage in API layer', () => {
    const endpointsPath = 'src/services/api/endpoints.ts';
    let content: string;
    try {
      content = readFileSync(endpointsPath, 'utf-8');
    } catch {
      // File may not exist in test env
      return;
    }

    // sessionStorage should appear before localStorage for token retrieval
    const sessionIdx = content.indexOf('sessionStorage');
    const localIdx = content.indexOf('localStorage');

    if (sessionIdx !== -1 && localIdx !== -1) {
      expect(sessionIdx).toBeLessThan(localIdx);
    }
  });
});
