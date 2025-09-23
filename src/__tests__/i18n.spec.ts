import { describe, it, expect } from 'vitest';
import { t } from '@/lib/i18n';

describe('i18n t()', () => {
  it('returns translations based on stored lang', () => {
    localStorage.setItem('lang', 'fr');
    expect(t('start')).toBe('Commencer');
    localStorage.setItem('lang', 'en');
    expect(t('start')).toBe('Start');
  });
});
