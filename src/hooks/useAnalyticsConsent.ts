
import { useLocalStorage } from './useLocalStorage';

export const useAnalyticsConsent = () => {
  const [consent, setConsent] = useLocalStorage('analytics-consent', false);

  const giveConsent = () => setConsent(true);
  const revokeConsent = () => setConsent(false);

  return {
    hasConsent: consent,
    giveConsent,
    revokeConsent
  };
};
