
import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useMusic } from '@/contexts/MusicContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * A debug component that tests access to all application contexts
 * Can be imported and rendered on any page to verify contexts are working
 */
const TestContextAccess: React.FC = () => {
  const { theme, setTheme, isDarkMode } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const { currentTrack, isPlaying } = useMusic();

  return (
    <Card className="max-w-lg mx-auto my-8">
      <CardHeader>
        <CardTitle>Context Access Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Theme Context:</h3>
          <ul className="list-disc pl-5">
            <li>Current theme: {theme}</li>
            <li>Dark mode: {isDarkMode ? 'Yes' : 'No'}</li>
          </ul>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-xs text-blue-500 hover:underline mt-1"
          >
            Toggle theme
          </button>
        </div>

        <div>
          <h3 className="font-medium mb-2">Auth Context:</h3>
          <ul className="list-disc pl-5">
            <li>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</li>
            <li>User role: {user?.role || 'Not logged in'}</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-2">User Preferences:</h3>
          <ul className="list-disc pl-5">
            <li>Theme preference: {preferences?.theme || 'Not set'}</li>
            <li>Language: {preferences?.language || 'Not set'}</li>
            <li>Sound enabled: {preferences?.soundEnabled ? 'Yes' : 'No'}</li>
            <li>Reduce motion: {preferences?.reduceMotion ? 'Yes' : 'No'}</li>
          </ul>
          <button 
            onClick={() => updatePreferences({ soundEnabled: !preferences?.soundEnabled })}
            className="text-xs text-blue-500 hover:underline mt-1"
          >
            Toggle sound
          </button>
        </div>

        <div>
          <h3 className="font-medium mb-2">Music Context:</h3>
          <ul className="list-disc pl-5">
            <li>Current track: {currentTrack?.title || 'None'}</li>
            <li>Playing: {isPlaying ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestContextAccess;
