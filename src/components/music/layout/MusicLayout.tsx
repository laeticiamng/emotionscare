
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useMusic } from '@/contexts/MusicContext';
import MusicControls from '../page/MusicControls';
import MusicDrawer from '../player/MusicDrawer';

const MusicLayout: React.FC = () => {
  const { initializeMusicSystem, error, currentTrack } = useMusic();
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeMusicSystem();
      } catch (err) {
        console.error('Error initializing music system:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
  }, [initializeMusicSystem]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        {/* Contenu principal */}
        <Outlet />
      </div>
      
      {/* Contrôles de musique fixes au bas de l'écran - si un morceau est en cours de lecture */}
      {currentTrack && !isLoading && !error && (
        <div className="sticky bottom-0 left-0 right-0 bg-background border-t p-3 shadow-lg">
          <MusicControls showDrawer={() => setDrawerOpen(true)} />
        </div>
      )}
      
      {/* Tiroir pour le lecteur de musique complet */}
      <MusicDrawer 
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default MusicLayout;
