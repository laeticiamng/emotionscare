import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { formatTime } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  Music,
  X
} from 'lucide-react';
import { cn } from "@/lib/utils";
// Import the Track type from our new location
import { Track } from '@/services/music/types';

export function MusicDrawer() {
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    playlist, 
    currentEmotion, 
    isDrawerOpen, 
    repeat, 
    shuffle, 
    playTrack, 
    pauseTrack, 
    nextTrack, 
    previousTrack, 
    setVolume, 
    toggleRepeat, 
    toggleShuffle, 
    closeDrawer 
  } = useMusic();

  return (
    <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
      <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b">
            <div className="flex justify-between items-center">
              <SheetTitle className="flex items-center">
                <Music className="mr-2 h-5 w-5" />
                Ambiance {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
              </SheetTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={closeDrawer}
                aria-label="Fermer le lecteur de musique"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          
          {currentTrack ? (
            <div className="p-6">
              {/* Now Playing Section */}
              <div className="mb-8">
                <h3 className="text-sm uppercase font-semibold text-muted-foreground mb-2">En cours de lecture</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                    {currentTrack.cover ? (
                      <img 
                        src={currentTrack.cover} 
                        alt={`${currentTrack.title} cover`} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="h-8 w-8 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold truncate">{currentTrack.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(currentTrack.duration)}</p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="mb-6">
                <div className="flex justify-center items-center space-x-4">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={toggleShuffle}
                    aria-label="Mélanger"
                    className={cn(
                      shuffle ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <Shuffle className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={previousTrack}
                    aria-label="Titre précédent"
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="default" 
                    onClick={isPlaying ? pauseTrack : () => playTrack(currentTrack)}
                    aria-label={isPlaying ? "Pause" : "Lecture"}
                    className="h-10 w-10 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={nextTrack}
                    aria-label="Titre suivant"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={toggleRepeat}
                    aria-label="Répéter"
                    className={cn(
                      repeat ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <Repeat className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="mb-8">
                <div className="flex items-center space-x-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setVolume(0)}
                    aria-label="Couper le son"
                    className="text-muted-foreground"
                  >
                    {volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  <Slider
                    value={[volume * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(values) => setVolume(values[0] / 100)}
                    aria-label="Volume"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              Aucune piste en cours de lecture
            </div>
          )}

          {/* Playlist */}
          <div className="flex-1 overflow-y-auto border-t">
            <div className="p-6">
              <h3 className="text-sm uppercase font-semibold text-muted-foreground mb-4">Playlist</h3>
              <ul className="space-y-2">
                {playlist?.tracks.map((track) => (
                  <li 
                    key={track.id} 
                    className={cn(
                      "flex items-center p-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
                      currentTrack?.id === track.id && "bg-accent"
                    )}
                    onClick={() => playTrack(track)}
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center mr-3 overflow-hidden">
                      {track.cover ? (
                        <img 
                          src={track.cover} 
                          alt={`${track.title} cover`} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(track.duration)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MusicDrawer;
