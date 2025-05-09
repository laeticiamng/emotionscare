
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MusicMiniPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    currentPlaylist,
    currentEmotion,
    playTrack, 
    pauseTrack, 
    nextTrack,
    previousTrack,
    loadPlaylistForEmotion
  } = useMusic();
  
  const { toast } = useToast();
  
  if (!currentTrack) {
    return null;
  }
  
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack(currentTrack);
    }
  };
  
  const handleNext = () => {
    nextTrack();
  };
  
  const handlePrevious = () => {
    previousTrack();
  };
  
  const handleRecommendedPlaylist = () => {
    if (!currentEmotion) return;
    
    const playlist = loadPlaylistForEmotion(currentEmotion);
    
    toast({
      title: "Playlist recommandée",
      description: `Playlist pour l'émotion "${currentEmotion}" chargée`
    });
  };
  
  // Trouver l'URL de couverture
  const getCoverImage = () => {
    if (!currentTrack) return null;
    
    if (currentTrack.cover) return currentTrack.cover;
    if (currentTrack.coverUrl) return currentTrack.coverUrl;
    if (currentTrack.coverImage) return currentTrack.coverImage;
    
    return null;
  };
  
  const coverImage = getCoverImage();
  
  // Gestionnaire d'événements pour clic sur cover
  const handleCoverClick = () => {
    // Navigation ou autre action
    console.log('Cover clicked');
  };
  
  return (
    <div className="flex items-center justify-between gap-3 p-2 bg-background border rounded-lg shadow-sm">
      {/* Cover image */}
      <div 
        className="w-10 h-10 rounded bg-muted flex-shrink-0 overflow-hidden cursor-pointer"
        onClick={handleCoverClick}
      >
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xs text-muted-foreground">
            No Cover
          </div>
        )}
      </div>
      
      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{currentTrack.title}</p>
        <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
      </div>
      
      {/* Controls */}
      <div className="flex items-center gap-1">
        <Button 
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={handlePrevious}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button 
          size="icon" 
          variant={isPlaying ? "secondary" : "default"}
          className="h-7 w-7"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        <Button 
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={handleNext}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MusicMiniPlayer;
