
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavbar from './navigation/MainNavbar';
import MainFooter from './navigation/MainFooter';
import { useTheme } from '@/contexts/ThemeContext';
import AudioControls from './audio/AudioControls';
import MusicMiniPlayer from './music/MusicMiniPlayer';
import { default as MusicDrawer } from './music/player/MusicDrawer';
import { useMusic } from '@/contexts/music';
import { ShellProps } from '@/types/layout';

const Shell: React.FC<ShellProps> = ({ 
  children, 
  hideNav = false, 
  hideFooter = false,
  className = "",
  immersive = false
}) => {
  const { theme } = useTheme();
  const soundEnabled = useTheme().preferences?.soundEnabled ?? false;
  const reduceMotion = useTheme().preferences?.reduceMotion ?? false;
  const { openDrawer, toggleDrawer, playlist, currentTrack } = useMusic();
  
  return (
    <div className={`flex flex-col min-h-screen ${className} ${theme}`}>
      {/* Fond animé pour les pages immersives */}
      {immersive && !reduceMotion && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-indigo-900"></div>
      )}
      
      {/* Arrière-plan adaptatif selon le thème */}
      <div className={`absolute inset-0 -z-20 transition-colors duration-500 ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-white to-blue-50/30' 
          : theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 to-blue-950' 
            : 'bg-gradient-to-br from-blue-50 to-blue-100'
      }`} />
      
      {/* Navigation */}
      {!hideNav && <MainNavbar />}

      {/* Contenu principal */}
      <main className="flex-1 relative z-0">
        {children || <Outlet />}
      </main>

      {/* Contrôles audio (si activé) */}
      {soundEnabled && !hideFooter && (
        <div className="fixed bottom-4 right-4 z-50">
          <AudioControls minimal />
        </div>
      )}

      <div className="fixed bottom-4 left-4 z-50">
        <MusicMiniPlayer />
      </div>

      <MusicDrawer
        open={openDrawer}
        onClose={toggleDrawer}
        onOpenChange={(open) => {
          if (!open) toggleDrawer();
        }}
        playlist={playlist || undefined}
        currentTrack={currentTrack || undefined}
      />

      {/* Footer */}
      {!hideFooter && <MainFooter />}
    </div>
  );
};

export default Shell;
