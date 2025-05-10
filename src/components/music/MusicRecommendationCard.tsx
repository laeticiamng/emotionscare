
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, PauseCircle, Music2 } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { MusicTrack } from '@/types/music';

interface MusicRecommendationCardProps {
  title: string;
  emotion: string;
  description?: string;
  onSelect?: () => void;
}

const MusicRecommendationCard: React.FC<MusicRecommendationCardProps> = ({
  title,
  emotion,
  description,
  onSelect
}) => {
  const { isPlaying, currentTrack, playTrack, pauseTrack, loadPlaylistForEmotion, setOpenDrawer } = useMusic();
  
  // Determine if this recommendation is currently playing
  const isCurrentEmotion = currentTrack?.emotion?.toLowerCase() === emotion.toLowerCase();
  const isCurrentlyPlaying = isPlaying && isCurrentEmotion;
  
  // Handle play/pause of recommendation
  const handleTogglePlay = () => {
    if (isCurrentlyPlaying) {
      pauseTrack();
    } else {
      const playlist = loadPlaylistForEmotion(emotion);
      if (playlist && playlist.tracks?.length > 0) {
        playTrack(playlist.tracks[0]);
      }
    }
  };
  
  // Function to open player drawer
  const handleOpenPlayer = () => {
    setOpenDrawer(true);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Music2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-base">{title}</h3>
              <p className="text-xs text-muted-foreground">Pour l'émotion: {emotion}</p>
            </div>
          </div>
          
          <Button
            variant={isCurrentlyPlaying ? "secondary" : "default"}
            size="sm"
            className="gap-1 h-9"
            onClick={handleTogglePlay}
          >
            {isCurrentlyPlaying ? <PauseCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isCurrentlyPlaying ? "Pause" : "Écouter"}</span>
          </Button>
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={() => {
            if (onSelect) {
              onSelect();
            } else {
              handleOpenPlayer();
            }
          }}
        >
          Voir plus
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendationCard;
