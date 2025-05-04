
import React, { useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { formatTime } from '@/lib/utils';
// Import the Track type that matches musicService.ts definition
import { Track } from '@/lib/musicService';

export function MusicMiniPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    playlist, 
    currentEmotion,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    openDrawer,
    loadPlaylistForEmotion
  } = useMusic();

  // Initialize player with default playlist if none loaded
  useEffect(() => {
    if (!playlist || !currentTrack) {
      loadPlaylistForEmotion('neutral');
    }
  }, [playlist, currentTrack, loadPlaylistForEmotion]);

  if (!playlist || !currentTrack) {
    return (
      <Card className="mb-6 overflow-hidden cursor-pointer" onClick={() => loadPlaylistForEmotion('neutral')}>
        <CardContent className="p-4">
          <div className="flex items-center">
            <h3 className="text-md font-medium flex items-center">
              <Music className="h-4 w-4 mr-2" />
              Soundtrack du jour
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto"
              onClick={(e) => {
                e.stopPropagation();
                loadPlaylistForEmotion('neutral');
              }}
            >
              Charger la musique
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 overflow-hidden cursor-pointer" onClick={openDrawer}>
      <CardContent className="p-4">
        <div className="flex items-center">
          <h3 className="text-md font-medium flex items-center">
            <Music className="h-4 w-4 mr-2" />
            Soundtrack du jour
          </h3>
          <span className="text-xs text-muted-foreground ml-2 bg-muted px-2 py-0.5 rounded-full">
            {currentEmotion}
          </span>
        </div>
        
        <div className="flex items-center mt-4 space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center shrink-0 overflow-hidden">
            {currentTrack.cover ? (
              <img 
                src={currentTrack.cover} 
                alt={`${currentTrack.title} cover`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="h-6 w-6 text-gray-500" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={(e) => {
                e.stopPropagation();
                previousTrack();
              }}
              aria-label="Titre précédent"
              className="h-8 w-8"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button 
              size="icon" 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                isPlaying ? pauseTrack() : playTrack(currentTrack);
              }}
              aria-label={isPlaying ? "Pause" : "Lecture"}
              className="h-8 w-8 rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={(e) => {
                e.stopPropagation();
                nextTrack();
              }}
              aria-label="Titre suivant"
              className="h-8 w-8"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MusicMiniPlayer;
