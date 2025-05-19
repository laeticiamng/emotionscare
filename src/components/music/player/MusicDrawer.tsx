
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { getTrackTitle, getTrackArtist, getTrackCover } from '@/utils/musicCompatibility';

interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  playlist?: any;
  currentTrack?: any;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({
  open,
  onOpenChange,
  onClose
}) => {
  const { 
    currentTrack, 
    playlist, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    previousTrack 
  } = useMusic();

  if (!currentTrack) {
    return null;
  }
  
  const title = getTrackTitle(currentTrack);
  const artist = getTrackArtist(currentTrack);
  const coverUrl = getTrackCover(currentTrack);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Music Player</SheetTitle>
          <SheetDescription>
            Control your music playback
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col items-center mt-6 space-y-6">
          {/* Album art */}
          <div className="w-48 h-48 rounded-lg overflow-hidden bg-muted">
            {coverUrl ? (
              <img 
                src={coverUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">No Cover</span>
              </div>
            )}
          </div>
          
          {/* Track info */}
          <div className="text-center">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-muted-foreground">{artist}</p>
          </div>
          
          {/* Player controls */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={previousTrack}>
              <SkipBack className="h-5 w-5" />
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
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </Button>
            
            <Button variant="outline" size="icon" onClick={nextTrack}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Playlist tracks */}
          {playlist && playlist.tracks && playlist.tracks.length > 0 && (
            <div className="w-full mt-6">
              <h4 className="font-medium mb-2">Playlist</h4>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {playlist.tracks.map((track: any) => (
                  <div 
                    key={track.id}
                    className={`p-2 rounded ${currentTrack.id === track.id ? 'bg-primary/10' : 'hover:bg-muted'}`}
                  >
                    <p className="font-medium text-sm">{getTrackTitle(track)}</p>
                    <p className="text-xs text-muted-foreground">{getTrackArtist(track)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MusicDrawer;
