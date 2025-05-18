import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavbar from './components/navigation/MainNavbar';
import MainFooter from './components/navigation/MainFooter';
import MusicMiniPlayer from './components/music/MusicMiniPlayer';
import MusicDrawer from './components/music/player/MusicDrawer';
import { useMusic } from './contexts/music';

interface ShellProps {
  enfants?: React.ReactNode;
  hideNav?: boolean;
}

const Shell: React.FC<ShellProps> = ({ enfants, hideNav = false }) => {
  const { openDrawer, toggleDrawer, playlist, currentTrack } = useMusic();

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNav && <MainNavbar />}

      <main className="flex-1 bg-gradient-to-b de-l'arrière-plan à-muted/20">
        {enfants || <Outlet />}
      </main>

      <div className="fixe bas-4 droite-4 z-50">
        <MusicMiniPlayer />
      </div>

      <MusicDrawer
        ouvert={openDrawer}
        onClose={toggleDrawer}
        onOpenChange={(ouvrir) => {
          if (!ouvrir) toggleDrawer();
        }}
        playlist={playlist || undefined}
        currentTrack={currentTrack || undefined}
      />

      {!hideNav && <MainFooter />}
    </div>
  );
};

export default Shell;