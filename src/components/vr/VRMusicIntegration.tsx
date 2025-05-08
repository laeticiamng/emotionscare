
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Badge } from '@/components/ui/badge';
import MusicControls from '../music/page/MusicControls';

interface VRMusicIntegrationProps {
  emotion?: string;
  showControls?: boolean;
}

const VRMusicIntegration: React.FC<VRMusicIntegrationProps> = ({
  emotion = 'calm',
  showControls = true
}) => {
  const { loadPlaylistForEmotion, currentPlaylist, currentTrack } = useMusic();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Charger la playlist appropriée pour l'émotion spécifiée
    if (emotion) {
      loadPlaylistForEmotion(emotion);
      setIsLoaded(true);
    }
  }, [emotion, loadPlaylistForEmotion]);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Music className="mr-2 h-5 w-5" />
            Musique thérapeutique
          </div>
          {emotion && (
            <Badge variant="outline" className="capitalize">
              {emotion}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoaded && currentPlaylist ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">
                {currentPlaylist.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentTrack 
                  ? `En cours: ${currentTrack.title} - ${currentTrack.artist}` 
                  : `${currentPlaylist.tracks.length} morceaux disponibles`}
              </p>
            </div>
            
            {showControls && (
              <MusicControls showDetails={false} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <p className="text-muted-foreground mb-3">
              Aucune musique sélectionnée
            </p>
            <Button 
              variant="outline"
              onClick={() => loadPlaylistForEmotion(emotion)}
              className="flex items-center"
            >
              <Play className="mr-2 h-4 w-4" />
              Charger une playlist
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VRMusicIntegration;
