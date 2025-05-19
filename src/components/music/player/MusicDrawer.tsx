
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useMusic } from '@/contexts/music';

interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  playlist?: any;
  currentTrack?: any;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({
  open,
  onClose,
  onOpenChange,
  playlist,
  currentTrack
}) => {
  const { isPlaying, togglePlay, nextTrack, prevTrack } = useMusic();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-96">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center">
            {currentTrack ? (
              <>
                <div className="w-36 h-36 bg-muted rounded-lg mb-4 overflow-hidden">
                  {currentTrack.cover && (
                    <img
                      src={currentTrack.cover}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
                <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
              </>
            ) : (
              <p className="text-muted-foreground">No track selected</p>
            )}
          </div>
          
          <div className="flex items-center justify-center space-x-4 py-6">
            <Button variant="ghost" size="icon" onClick={prevTrack}>
              <SkipBack className="h-6 w-6" />
            </Button>
            
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={nextTrack}>
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MusicDrawer;
