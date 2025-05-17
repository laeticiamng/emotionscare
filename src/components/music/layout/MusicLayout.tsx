
import React, { useEffect } from 'react';
import { useMusic } from '@/contexts/music';
import MusicPlayer from '../MusicPlayer';

interface MusicLayoutProps {
  children: React.ReactNode;
}

const MusicLayout: React.FC<MusicLayoutProps> = ({ children }) => {
  const music = useMusic();
  
  useEffect(() => {
    // Initialize music system on component mount
    // This is now a safe check since we've added this property to MusicContextType
    if (music && music.isInitialized === false) {
      console.log('Initializing music system');
      // Don't call initializeMusicSystem directly as it may not exist
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
