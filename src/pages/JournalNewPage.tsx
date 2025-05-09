
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import JournalEntryForm from '@/components/journal/JournalEntryForm';
import JournalPageHeader from '@/components/journal/JournalPageHeader';
import BackgroundAnimation from '@/components/journal/BackgroundAnimation';
import { useJournalEntry } from '@/hooks/useJournalEntry';
import { useMusic } from '@/contexts/MusicContext';
import { Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import MusicPlayer from '@/components/music/player/MusicPlayer';

const JournalNewPage: React.FC = () => {
  const { 
    isSaving, 
    backgroundGradient, 
    setRandomGradient, 
    handleSave,
    currentEmotion,
    setCurrentEmotion
  } = useJournalEntry();
  
  const { 
    openDrawer, 
    setOpenDrawer, 
    currentTrack, 
    loadPlaylistForEmotion 
  } = useMusic();
  
  const [musicEnabled, setMusicEnabled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setRandomGradient();
  }, []);

  const handleEnableMusic = () => {
    setMusicEnabled(true);
    setOpenDrawer(true);
    
    // If we have a detected emotion, load an appropriate playlist
    if (currentEmotion) {
      loadPlaylistForEmotion(currentEmotion);
    }
  };

  // Determine which component to use based on device
  const MusicDrawerComponent = isMobile ? Drawer : Sheet;
  const MusicDrawerTrigger = isMobile ? DrawerTrigger : SheetTrigger;
  const MusicDrawerContentComponent = isMobile ? DrawerContent : SheetContent;

  return (
    <div className={`container mx-auto py-8 min-h-[80vh] relative ${backgroundGradient}`}>
      <BackgroundAnimation 
        musicEnabled={musicEnabled || !!currentTrack} 
        emotion={currentEmotion || 'neutral'}
      />

      <JournalPageHeader title="Nouvelle Entrée de Journal">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-primary transition-colors" 
          onClick={handleEnableMusic}
        >
          <Music className="mr-2 h-4 w-4" />
          {musicEnabled ? "Musique activée" : "Ajouter musique"}
        </Button>
      </JournalPageHeader>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <JournalEntryForm 
          onSubmit={handleSave} 
          isSaving={isSaving} 
          onEmotionSelect={setCurrentEmotion}
        />
      </motion.div>

      <MusicDrawerComponent open={openDrawer} onOpenChange={setOpenDrawer}>
        <MusicDrawerTrigger asChild>
          <Button 
            className="fixed bottom-4 right-4 rounded-full shadow-lg"
            size="icon"
            variant={currentTrack ? "secondary" : "outline"}
          >
            <Music className="h-4 w-4" />
          </Button>
        </MusicDrawerTrigger>
        <MusicDrawerContentComponent side="right" className="sm:max-w-md">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Musique Thérapeutique</h2>
            <MusicPlayer />
          </div>
        </MusicDrawerContentComponent>
      </MusicDrawerComponent>
    </div>
  );
};

export default JournalNewPage;
