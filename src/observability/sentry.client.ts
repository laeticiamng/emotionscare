import { hasConsent, onConsentChange } from '@/lib/consent';
import { initializeSentry, monitorDOMErrors } from '@/lib/sentry-config';

if (typeof window !== 'undefined') {
  const startSentry = () => {
    const initialized = initializeSentry();
    if (initialized) {
      monitorDOMErrors();
    }
  };

  if (hasConsent('analytics')) {
    startSentry();
  } else {
    const unsubscribe = onConsentChange(preferences => {
      if (preferences.categories.analytics) {
        unsubscribe();
        startSentry();
      }
    });
  }
}
