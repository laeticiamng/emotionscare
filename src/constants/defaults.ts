
import { UserPreferences } from '@/types/preferences';

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'inter',
  language: 'fr',
  notifications: {
    email: true,
    push: true,
    sounds: true
  },
  haptics: true,
  dataCollection: true,
  privacyLevel: 'balanced',
  animations: true,
  soundEffects: true,
  reduceMotion: false,
  colorBlindMode: false,
  autoplayMedia: true,
  sound: {
    volume: 0.5,
    effects: true,
    music: true
  }
};
