
// Exporte tous les contextes centralisés pour une importation facile

import { useTheme, ThemeProvider } from './ThemeContext';
import { useLayout, LayoutProvider } from './LayoutContext';
import { useUserPreferences, UserPreferencesProvider } from './UserPreferencesContext';
import { useAudio, AudioProvider } from './audio/AudioContext';
import { useMusic, MusicProvider } from './MusicContext';

export {
  useTheme,
  ThemeProvider,
  useLayout,
  LayoutProvider,
  useUserPreferences,
  UserPreferencesProvider,
  useAudio,
  AudioProvider,
  useMusic,
  MusicProvider
};
