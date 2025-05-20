import { usePreferences } from '@/contexts/PreferencesContext';

/**
 * Hook returning whether analytics tracking is allowed according
 * to the current user privacy preferences.
 */
export function useAnalyticsConsent(): boolean {
  const { privacy } = usePreferences();
  if (!privacy) return false;
  if (typeof privacy === 'string') {
    // simple preset: "private" disables analytics
    return privacy !== 'private';
  }
  return !!privacy.analytics;
}

export default useAnalyticsConsent;
