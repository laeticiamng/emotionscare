
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import EnhancedMusicPlayer from './EnhancedMusicPlayer';
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
            className="fixed bottom-4 left-4 z-50 shadow-lg"
          >
            <Music className="h-4 w-4" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] p-0">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle>Lecteur Musical</SheetTitle>
        </SheetHeader>
        <div className="p-6 pt-4 h-full overflow-auto">
          <EnhancedMusicPlayer 
            track={currentTrack}
            className="max-w-2xl mx-auto"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MusicDrawer;
