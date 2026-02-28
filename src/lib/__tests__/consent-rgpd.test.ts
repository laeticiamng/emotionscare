import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock modules needed by consent
vi.mock('@/lib/logger', () => ({
  logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

describe('consent — gestion du consentement RGPD', () => {
  beforeEach(async () => {
    localStorage.clear();
    // Re-import to reset module state
    vi.resetModules();
  });

  it('retourne les préférences par défaut sans stockage', async () => {
    const { getConsentPreferences, resetStoredConsent } = await import('@/lib/consent');
    resetStoredConsent();
    const prefs = getConsentPreferences();
    expect(prefs.categories.functional).toBe(true);
    expect(prefs.categories.analytics).toBe(false);
  });

  it('persiste le consentement analytics', async () => {
    const { setConsentPreferences, getConsentPreferences, resetStoredConsent } = await import('@/lib/consent');
    resetStoredConsent();

    setConsentPreferences({ analytics: true });
    const prefs = getConsentPreferences();
    expect(prefs.categories.analytics).toBe(true);
  });

  it('functional est toujours true même si override tenté', async () => {
    const { setConsentPreferences, getConsentPreferences, resetStoredConsent } = await import('@/lib/consent');
    resetStoredConsent();

    // functional can't be set to false
    setConsentPreferences({ analytics: false });
    const prefs = getConsentPreferences();
    expect(prefs.categories.functional).toBe(true);
  });

  it('notifie les listeners lors d\'un changement', async () => {
    const { setConsentPreferences, onConsentChange, resetStoredConsent } = await import('@/lib/consent');
    resetStoredConsent();

    const listener = vi.fn();
    const unsub = onConsentChange(listener);

    setConsentPreferences({ analytics: true });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].categories.analytics).toBe(true);

    unsub();
    setConsentPreferences({ analytics: false });
    expect(listener).toHaveBeenCalledTimes(1); // not called again
  });

  it('hasConsent retourne correctement', async () => {
    const { hasConsent, setConsentPreferences, resetStoredConsent } = await import('@/lib/consent');
    resetStoredConsent();

    expect(hasConsent('functional')).toBe(true);
    expect(hasConsent('analytics')).toBe(false);

    setConsentPreferences({ analytics: true });
    expect(hasConsent('analytics')).toBe(true);
  });

  it('resetStoredConsent efface tout', async () => {
    const { setConsentPreferences, resetStoredConsent, hasStoredConsentPreferences } = await import('@/lib/consent');
    resetStoredConsent();

    setConsentPreferences({ analytics: true });
    expect(hasStoredConsentPreferences()).toBe(true);

    resetStoredConsent();
    expect(hasStoredConsentPreferences()).toBe(false);
  });
});
