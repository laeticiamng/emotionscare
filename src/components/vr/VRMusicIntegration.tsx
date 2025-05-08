
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, Volume2 } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Badge } from '@/components/ui/badge';
import MusicControls from '../music/page/MusicControls';
import { Slider } from '@/components/ui/slider';

interface VRMusicIntegrationProps {
  emotion?: string;
  showControls?: boolean;
  enhancedVisualization?: boolean;
}

const VRMusicIntegration: React.FC<VRMusicIntegrationProps> = ({
  emotion = 'calm',
  showControls = true,
  enhancedVisualization = false
}) => {
  const { loadPlaylistForEmotion, currentPlaylist, currentTrack, volume, setVolume } = useMusic();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Charger la playlist appropriée pour l'émotion spécifiée
    if (emotion) {
      loadPlaylistForEmotion(emotion);
      setIsLoaded(true);
    }
  }, [emotion, loadPlaylistForEmotion]);
  
  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0] / 100);
  };
  
  return (
    <Card className="overflow-hidden">
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
            
            {enhancedVisualization && (
              <div className="h-12 bg-primary/10 rounded-md flex items-center justify-center overflow-hidden">
                {/* Animation simplifiée pour ambiance VR */}
                <div className="flex items-end h-8 space-x-1">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const randomHeight = 20 + Math.random() * 60;
                    return (
                      <div 
                        key={i}
                        className="w-1 bg-primary/80 rounded-t"
                        style={{ 
                          height: `${randomHeight}%`,
                          animationDuration: `${0.8 + Math.random() * 0.7}s`,
                          animationName: 'pulse',
                          animationIterationCount: 'infinite',
                          animationDirection: 'alternate'
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            
            {showControls ? (
              <MusicControls showDetails={false} />
            ) : (
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  defaultValue={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-full"
                />
              </div>
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
      
      <style jsx>{`
        @keyframes pulse {
          0% { height: 20%; }
          100% { height: 80%; }
        }
      `}</style>
    </Card>
  );
};

export default VRMusicIntegration;
