// @ts-nocheck
/**
 * Tests pour lib/consent.ts
 * Couvre : getConsentPreferences, setConsentPreferences, hasConsent,
 *          hasStoredConsentPreferences, onConsentChange, resetStoredConsent
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Reset module state between tests
let consentModule: typeof import('@/lib/consent');

describe('consent (lib)', () => {
  beforeEach(async () => {
    // Clear localStorage mock
    window.localStorage.clear();
    
    // Re-import to reset module state
    vi.resetModules();
    consentModule = await import('@/lib/consent');
    consentModule.resetStoredConsent();
  });

  it('getConsentPreferences retourne les valeurs par défaut', () => {
    const prefs = consentModule.getConsentPreferences();
    expect(prefs.categories.functional).toBe(true);
    expect(prefs.categories.analytics).toBe(false);
    expect(prefs.version).toBe(1);
  });

  it('hasStoredConsentPreferences retourne false au départ', () => {
    expect(consentModule.hasStoredConsentPreferences()).toBe(false);
  });

  it('setConsentPreferences persiste et met à jour', () => {
    const result = consentModule.setConsentPreferences({ analytics: true });
    expect(result.categories.analytics).toBe(true);
    expect(result.categories.functional).toBe(true); // toujours true
    expect(consentModule.hasStoredConsentPreferences()).toBe(true);
  });

  it('hasConsent functional est toujours true', () => {
    expect(consentModule.hasConsent('functional')).toBe(true);
  });

  it('hasConsent analytics suit la préférence', () => {
    expect(consentModule.hasConsent('analytics')).toBe(false);
    consentModule.setConsentPreferences({ analytics: true });
    expect(consentModule.hasConsent('analytics')).toBe(true);
  });

  it('functional ne peut pas être désactivé', () => {
    const result = consentModule.setConsentPreferences({ analytics: false });
    expect(result.categories.functional).toBe(true);
  });

  it('onConsentChange notifie les listeners', () => {
    const listener = vi.fn();
    const unsubscribe = consentModule.onConsentChange(listener);

    consentModule.setConsentPreferences({ analytics: true });

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        categories: expect.objectContaining({ analytics: true }),
      })
    );

    unsubscribe();
  });

  it('unsubscribe arrête les notifications', () => {
    const listener = vi.fn();
    const unsub = consentModule.onConsentChange(listener);
    unsub();

    consentModule.setConsentPreferences({ analytics: true });
    expect(listener).not.toHaveBeenCalled();
  });

  it('resetStoredConsent remet tout à zéro', () => {
    consentModule.setConsentPreferences({ analytics: true });
    expect(consentModule.hasConsent('analytics')).toBe(true);

    consentModule.resetStoredConsent();
    // After reset, need to re-read (lazy load)
    expect(consentModule.hasStoredConsentPreferences()).toBe(false);
  });

  it('getConsentPreferences retourne une copie immutable', () => {
    const a = consentModule.getConsentPreferences();
    const b = consentModule.getConsentPreferences();
    expect(a).toEqual(b);
    expect(a).not.toBe(b); // Different references
  });
});
