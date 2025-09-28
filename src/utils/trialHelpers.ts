
export const TRIAL_DURATION_DAYS = 3;

export const calculateTrialEndDate = (): string => {
  const now = new Date();
  const trialEnd = new Date(now.getTime() + (TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000));
  return trialEnd.toISOString();
};

export const isTrialEndingSoon = (trialEndsAt: string | null): boolean => {
  if (!trialEndsAt) return false;
  
  const now = new Date();
  const trialEnd = new Date(trialEndsAt);
  const oneDayInMs = 24 * 60 * 60 * 1000;
  
  return (trialEnd.getTime() - now.getTime()) <= oneDayInMs;
};

export const isTrialExpired = (trialEndsAt: string | null): boolean => {
  if (!trialEndsAt) return false;
  
  const now = new Date();
  const trialEnd = new Date(trialEndsAt);
  
  return now > trialEnd;
};

export const isDemoAccount = (email: string): boolean => {
  return email.endsWith('@example.fr');
};

export const isProductionEmailAllowed = (email: string): boolean => {
  // En production, refuser les emails @example.fr sauf pour la démo
  return !email.endsWith('@example.fr') || isDemoAccount(email);
};
