// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn (class name merger)', () => {
  it('fusionne des classes simples', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('gère les conditions', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('déduplique les classes Tailwind conflictuelles', () => {
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2');
  });

  it('gère undefined et null', () => {
    expect(cn('a', undefined, null, 'b')).toBe('a b');
  });

  it('retourne vide sans arguments', () => {
    expect(cn()).toBe('');
  });
});
