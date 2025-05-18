
import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useMusic } from '@/contexts/music';

const TestContextAccess: React.FC = () => {
  // Accès au contexte de thème
  const themeContext = useTheme();
  
  // Accès au contexte de préférences (version standard)
  const preferencesContext = usePreferences();
  
  // Accès au contexte de préférences utilisateur (version étendue)
  const userPrefContext = useUserPreferences();
  
  // Accès au contexte de musique
  const musicContext = useMusic();

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-4">Test d'accès aux contextes</h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium">ThemeContext:</h3>
          <pre className="bg-muted p-2 rounded text-xs overflow-auto">
            {JSON.stringify({ 
              theme: themeContext.theme, 
              setTheme: typeof themeContext.setTheme 
            }, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-medium">PreferencesContext:</h3>
          <pre className="bg-muted p-2 rounded text-xs overflow-auto">
            {JSON.stringify({ 
              theme: preferencesContext.preferences.theme,
              language: preferencesContext.preferences.language,
              isLoading: preferencesContext.isLoading,
              updatePreferences: typeof preferencesContext.updatePreferences
            }, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-medium">UserPreferencesContext:</h3>
          <pre className="bg-muted p-2 rounded text-xs overflow-auto">
            {JSON.stringify({ 
              theme: userPrefContext.preferences.theme,
              language: userPrefContext.preferences.language,
              updatePreferences: typeof userPrefContext.updatePreferences
            }, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-medium">MusicContext:</h3>
          <pre className="bg-muted p-2 rounded text-xs overflow-auto">
            {JSON.stringify({ 
              currentTrack: musicContext.currentTrack ? {
                id: musicContext.currentTrack.id,
                title: musicContext.currentTrack.title || musicContext.currentTrack.name
              } : null,
              isPlaying: musicContext.isPlaying,
              volume: musicContext.volume,
              isInitialized: musicContext.isInitialized,
              togglePlay: typeof musicContext.togglePlay,
              nextTrack: typeof musicContext.nextTrack
            }, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-6 space-x-2">
        <button 
          onClick={() => themeContext.setTheme(themeContext.theme === 'dark' ? 'light' : 'dark')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Toggle Theme
        </button>
        
        <button 
          onClick={() => musicContext.togglePlay()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          disabled={!musicContext.currentTrack}
        >
          {musicContext.isPlaying ? 'Pause' : 'Play'} Music
        </button>
      </div>
    </div>
  );
};

export default TestContextAccess;
