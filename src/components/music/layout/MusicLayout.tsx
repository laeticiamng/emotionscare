
import React, { useEffect } from 'react';
import { useMusic } from '@/contexts/music';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import MusicPlayer from '../MusicPlayer';

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
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement du système musical...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur: {error}. Veuillez actualiser la page ou vérifier les paramètres de votre navigateur.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 shadow-md bg-card">
        <MusicPlayer />
      </Card>
      {children}
    </div>
  );
};

export default MusicLayout;
