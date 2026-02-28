import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../sanitize';

describe('escapeHtml', () => {
  it('échappe les balises HTML', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('échappe les guillemets', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('échappe les apostrophes', () => {
    expect(escapeHtml("it's")).toBe('it&#x27;s');
  });

  it('échappe les ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('gère null et undefined', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  it('gère les nombres', () => {
    expect(escapeHtml(42)).toBe('42');
  });

  it('chaîne vide retourne chaîne vide', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('texte sans caractères spéciaux inchangé', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });

  it('gère une attaque XSS complexe', () => {
    const payload = '<img src=x onerror="alert(document.cookie)">';
    const result = escapeHtml(payload);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).not.toContain('"');
  });
});
