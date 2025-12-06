
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VRSessionTemplate } from '@/types/vr';
import { Music, Volume2, VolumeX } from 'lucide-react';

interface VRMusicIntegrationProps {
  template: VRSessionTemplate;
  emotionTarget: string;
  onMusicReady?: () => void;
}

const VRMusicIntegration: React.FC<VRMusicIntegrationProps> = ({
  template,
  emotionTarget,
  onMusicReady
}) => {
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (isMusicEnabled && onMusicReady) {
      onMusicReady();
    }
  }, [isMusicEnabled, onMusicReady]);

  const toggleMusic = () => {
    setIsMusicEnabled(!isMusicEnabled);
    if (!isMusicEnabled) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const adjustVolume = (newVolume: number) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Ambiance musicale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Musique adaptée à l'environnement
          </span>
          <Button
            variant={isMusicEnabled ? "default" : "outline"}
            size="sm"
            onClick={toggleMusic}
          >
            {isMusicEnabled ? "Activée" : "Désactivée"}
          </Button>
        </div>

        {isMusicEnabled && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlayPause}
              >
                {isPlaying ? "Pause" : "Play"}
              </Button>
              
              <div className="flex items-center gap-2 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustVolume(volume === 0 ? 0.7 : 0)}
                >
                  {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Musique recommandée pour: {emotionTarget || template.category}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VRMusicIntegration;
