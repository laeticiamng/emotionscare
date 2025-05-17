
import React, { useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import MusicPlayer from '../MusicPlayer';

interface MusicLayoutProps {
  children: React.ReactNode;
}

const MusicLayout: React.FC<MusicLayoutProps> = ({ children }) => {
  const music = useMusic();
  
  useEffect(() => {
    // Initialize music system on component mount
    if (music && music.isInitialized === false && music.initializeMusicSystem) {
      console.log('Initializing music system');
      music.initializeMusicSystem();
    }
  }, [music]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        {children}
      </div>
      <div className="sticky bottom-0 w-full">
        <MusicPlayer />
      </div>
    </div>
  );
};

export default MusicLayout;
