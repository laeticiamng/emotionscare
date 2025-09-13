import { describe, it, expect } from 'vitest';
import { t } from '@/COMPONENTS.reg';

describe('i18n t()', () => {
  it('returns translations based on stored lang', () => {
    localStorage.setItem('lang', 'fr');
    expect(t('start')).toBe('Commencer');
    localStorage.setItem('lang', 'en');
    expect(t('start')).toBe('Start');
  });
});
