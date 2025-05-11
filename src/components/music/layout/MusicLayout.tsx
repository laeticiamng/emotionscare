
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';
import MusicControls from '../player/MusicControls';

const MusicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    isInitialized, 
    initializeMusicSystem, 
    error,
    openDrawer
  } = useMusic();
  
  useEffect(() => {
    if (!isInitialized) {
      initializeMusicSystem();
    }
  }, [isInitialized, initializeMusicSystem]);
  
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-4 border-red-300">
          <h2 className="text-lg font-semibold text-red-600">Error loading music system</h2>
          <p className="text-red-500">{error}</p>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex-1">
        {children}
      </div>
      
      <div className="sticky bottom-0 left-0 right-0 bg-background py-2">
        <Card className="mx-auto max-w-4xl">
          <MusicControls showDrawer={openDrawer} />
        </Card>
      </div>
    </div>
  );
};

export default MusicLayout;
