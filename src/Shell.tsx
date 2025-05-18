import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavbar from './components/navigation/MainNavbar';
import MainFooter from './components/navigation/MainFooter';
import MusicMiniPlayer from './components/music/MusicMiniPlayer';
import MusicDrawer from './components/music/player/MusicDrawer';
import { useMusic } from './contexts/music';

interface ShellProps {
  children?: React.ReactNode;
  hideNav?: boolean;
}

const Shell: React.FC<ShellProps> = ({ children, hideNav = false }) => {
  const { openDrawer, toggleDrawer, playlist, currentTrack } = useMusic();

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNav && <MainNavbar />}

      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        {children || <Outlet />}
      </main>

      <div className="fixed bottom-4 right-4 z-50">
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

      {!hideNav && <MainFooter />}
    </div>
  );
};

export default Shell;