// @ts-nocheck

/**
 * Utilitaire pour mapper les propriétés de préférences utilisateur
 * entre formats anciens et nouveaux
 */

import { UserPreferences } from '@/types/preferences';

type PreferenceKey = keyof UserPreferences | string;

/**
 * Mappe les clés de préférences du format plat vers le format hiérarchique
 */
export const mapPreferenceKeyToPath = (key: string): string => {
  // Table de mappage pour les clés de préférences courantes
  const keyMappings: Record<string, string> = {
    'notificationsEnabled': 'notifications.enabled',
    'emailNotifications': 'notifications.emailEnabled',
    'pushNotifications': 'notifications.pushEnabled',
    'newsletterEnabled': 'notifications.newsletterEnabled',
    'shareData': 'privacy',
    'anonymizedData': 'privacy',
  };

  return keyMappings[key] || key;
};

/**
 * Obtient la valeur d'une préférence à partir d'un chemin hiérarchique
 */
export const getPreferenceValue = (
  preferences: UserPreferences | undefined, 
  path: string
): any => {
  if (!preferences) return undefined;
  
  if (path.includes('.')) {
    const [parent, child] = path.split('.');
    const parentObj = preferences[parent as keyof UserPreferences];
    
    if (typeof parentObj === 'object' && parentObj !== null) {
      return (parentObj as any)[child];
    }
    return undefined;
  }
  
  return preferences[path as keyof UserPreferences];
};

/**
 * Construit un objet de préférence à partir d'une clé et d'une valeur
 */
export const buildPreferenceUpdate = (key: string, value: any): Partial<UserPreferences> => {
  const path = mapPreferenceKeyToPath(key);
  
  if (path.includes('.')) {
    const [parent, child] = path.split('.');
    return {
      [parent]: {
        ...(typeof parent === 'object' ? parent : {}),
        [child]: value
      }
    } as Partial<UserPreferences>;
  }
  
  return { [key]: value } as Partial<UserPreferences>;
};
