
import React, { useEffect } from 'react';
import { useMusic } from '@/contexts/music/MusicContextProvider';
import { Loader2 } from 'lucide-react';

interface MusicLayoutProps {
  children: React.ReactNode;
}

const MusicLayout: React.FC<MusicLayoutProps> = ({ children }) => {
  const { isInitialized, initializeMusicSystem, error } = useMusic();
  
  useEffect(() => {
    if (!isInitialized && initializeMusicSystem) {
      initializeMusicSystem();
    }
  }, [isInitialized, initializeMusicSystem]);
  
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Initialisation du système audio...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-destructive">
        <h2 className="text-xl font-bold">Erreur d'initialisation audio</h2>
        <p>{error.message}</p>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default MusicLayout;
