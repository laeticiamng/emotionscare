
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import PremiumMusicPlayer from './PremiumMusicPlayer';
import { useMusic } from '@/hooks/useMusic';

interface MusicDrawerProps {
  children?: React.ReactNode;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ children }) => {
  const { currentTrack } = useMusic();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button 
            variant="outline" 
            size="icon" 
            className="fixed bottom-4 left-4 z-50 shadow-lg bg-gradient-to-r from-primary to-secondary text-white border-0 hover:shadow-xl transition-all duration-300"
          >
            <Music className="h-4 w-4" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] p-0">
        <SheetHeader className="p-6 pb-0 bg-gradient-to-r from-primary/10 to-secondary/10">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Lecteur Musical Premium
          </SheetTitle>
          {currentTrack && (
            <p className="text-muted-foreground">
              En cours : {currentTrack.title} - {currentTrack.artist}
            </p>
          )}
        </SheetHeader>
        <div className="p-6 pt-4 h-full overflow-auto">
          <PremiumMusicPlayer className="max-w-4xl mx-auto" />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MusicDrawer;
