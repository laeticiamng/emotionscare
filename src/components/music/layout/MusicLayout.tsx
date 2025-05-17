
import React, { useEffect } from 'react';
import { useMusic } from '@/contexts';
import MusicPlayer from '../MusicPlayer';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface MusicLayoutProps {
  children: React.ReactNode;
}

const MusicLayout: React.FC<MusicLayoutProps> = ({ children }) => {
  const { isPlaying, currentTrack, isInitialized } = useMusic();

  return (
    <div className="flex flex-col min-h-screen space-y-4">
      <div className="flex-1 container mx-auto p-4">
        {isInitialized ? (
          <>
            {children}
            
            {currentTrack && (
              <div className="fixed bottom-0 left-0 right-0 z-50">
                <MusicPlayer />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Initialisation du système audio...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicLayout;
