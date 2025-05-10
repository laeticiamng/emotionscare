
import React, { useEffect, useRef } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { X, Music2, Play, Pause, SkipBack, SkipForward, Clock, ListMusic } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import MusicPlayer from './MusicPlayer';

interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ open, onClose }) => {
  const { currentTrack, playTrack, isPlaying, pauseTrack, nextTrack, currentPlaylist } = useMusic();
  const drawerRef = useRef<HTMLDivElement>(null);
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Close drawer when escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);
  
  const handlePlayTrack = (track: any) => {
    playTrack(track);
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]" ref={drawerRef}>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="flex flex-row items-center justify-between px-4">
            <DrawerTitle className="flex items-center gap-2">
              <Music2 className="h-5 w-5" /> Lecteur musical
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          
          {/* Player component */}
          <div className="px-4 pb-2">
            <MusicPlayer />
          </div>
          
          {/* Playlist section */}
          {currentPlaylist && currentPlaylist.tracks && currentPlaylist.tracks.length > 0 && (
            <div className="px-4 pb-8">
              <div className="flex items-center justify-between py-2">
                <h3 className="text-sm font-medium flex items-center gap-1.5">
                  <ListMusic className="h-4 w-4 text-muted-foreground" />
                  {currentPlaylist.name || "Playlist actuelle"}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {currentPlaylist.tracks.length} pistes
                </span>
              </div>
              
              <Separator className="my-2" />
              
              <ScrollArea className="h-[200px] pr-2">
                <ul className="space-y-1">
                  {currentPlaylist.tracks.map((track, index) => {
                    const isCurrentTrack = currentTrack && currentTrack.id === track.id;
                    
                    return (
                      <li 
                        key={`${track.id}-${index}`} 
                        className={cn(
                          "flex items-center justify-between rounded-md p-2 transition-colors",
                          isCurrentTrack 
                            ? "bg-primary/10 text-primary" 
                            : "hover:bg-muted/50 cursor-pointer"
                        )}
                        onClick={() => handlePlayTrack(track)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 bg-muted flex items-center justify-center rounded overflow-hidden">
                            {track.cover || track.coverUrl || track.coverImage ? (
                              <img 
                                src={track.cover || track.coverUrl || track.coverImage} 
                                alt={track.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Music2 className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="overflow-hidden flex-1">
                            <p className={cn(
                              "truncate text-sm",
                              isCurrentTrack ? "font-medium" : ""
                            )}>
                              {track.title}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {track.artist}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isCurrentTrack && isPlaying ? (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                pauseTrack();
                              }}
                            >
                              <Pause className="h-3.5 w-3.5" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={cn("h-8 w-8", isCurrentTrack ? "text-primary" : "")}
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayTrack(track);
                              }}
                            >
                              <Play className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(track.duration || 0)}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
