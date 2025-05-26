
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
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (musicEnabled && onMusicReady) {
      onMusicReady();
    }
  }, [musicEnabled, onMusicReady]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Musique d'ambiance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Activer la musique</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMusicEnabled(!musicEnabled)}
          >
            {musicEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>

        {musicEnabled && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Volume</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full mt-1"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Musique adaptée pour: {emotionTarget}</p>
              <p>Environnement: {template.environment}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VRMusicIntegration;
