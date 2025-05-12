
import React, { useState, useEffect } from 'react';
import MusicTabs from '@/components/music/page/MusicTabs';
import { useMusic } from '@/contexts/MusicContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageTitle from '@/components/ui/page-title';
import { Button } from '@/components/ui/button';
import NewPlaylistDialog from '@/components/music/NewPlaylistDialog';

const MusicPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('player');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { initializeMusicSystem, error, currentTrack } = useMusic();
  const { toast } = useToast();
  const [openFormDialog, setOpenFormDialog] = useState(false);

  useEffect(() => {
    const loadMusic = async () => {
      try {
        setIsLoading(true);
        await initializeMusicSystem();
      } catch (err) {
        console.error("Error initializing music system:", err);
        toast({
          title: "Initialization Error",
          description: "Unable to load the music module. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMusic();
  }, [initializeMusicSystem, toast]);

  // Dynamic title based on current track
  const getPageTitle = () => {
    if (currentTrack) {
      return `Music Therapy - ${currentTrack.title} by ${currentTrack.artist}`;
    }
    return "Music Therapy";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading music module...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium text-destructive mb-2">Loading Error</h2>
        <p className="text-muted-foreground">
          An error occurred while loading the music module.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <PageTitle
        title={getPageTitle()}
        description="Listen to music adapted to your emotional state"
      />
      
      <div className="mt-6">
        <MusicTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <NewPlaylistDialog 
        open={openFormDialog} 
        setOpen={setOpenFormDialog} 
      />
    </div>
  );
};

export default MusicPage;
