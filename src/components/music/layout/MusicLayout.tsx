
import React, { useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MusicLayoutProps {
  children: React.ReactNode;
}

const MusicLayout: React.FC<MusicLayoutProps> = ({ children }) => {
  const { isInitialized, initializeMusicSystem, error } = useMusic();
  const { toast } = useToast();

  useEffect(() => {
    const loadMusic = async () => {
      try {
        await initializeMusicSystem();
      } catch (err) {
        console.error('Error initializing music system:', err);
        toast({
          title: 'Error',
          description: 'Failed to initialize music system. Please try again.',
          variant: 'destructive'
        });
      }
    };

    if (!isInitialized) {
      loadMusic();
    }
  }, [isInitialized, initializeMusicSystem, toast]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading music system...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium text-destructive mb-2">Error loading music system</h2>
        <p className="text-muted-foreground">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default MusicLayout;
