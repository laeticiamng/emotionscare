import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Music, Disc } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { logger } from '@/lib/logger';

interface RecommendedPresetsProps {
  className?: string;
  currentMood?: string;
}

const RecommendedPresets: React.FC<RecommendedPresetsProps> = ({
  className = '',
}) => {
  const { getRecommendationsForEmotion, setPlaylist } = useMusic();
  const [loading, setLoading] = useState(false);
  
  // Presets based on different moods/activities
  const presets = [
    { id: 'focus', name: 'Concentration', icon: <Disc className="h-5 w-5" />, description: 'Pour les sessions de travail intensif' },
    { id: 'relax', name: 'Relaxation', icon: <Music className="h-5 w-5" />, description: 'Pour se détendre après une journée chargée' },
    { id: 'energize', name: 'Énergie', icon: <Play className="h-5 w-5" />, description: 'Pour se motiver et se dynamiser' },
    { id: 'sleep', name: 'Sommeil', icon: <Music className="h-5 w-5" />, description: 'Pour faciliter l\'endormissement' }
  ];
  
  const handlePlayPreset = async (presetId: string) => {
    setLoading(true);
    try {
      const tracks = await getRecommendationsForEmotion(presetId);
      if (tracks && tracks.length > 0) {
        setPlaylist(tracks);
      }
    } catch (error) {
      logger.error('Error loading preset:', error instanceof Error ? error : new Error(String(error)), 'MUSIC');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Préréglages recommandés</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {presets.map(preset => (
          <Button
            key={preset.id}
            variant="outline"
            className="flex flex-col items-start justify-start h-auto p-4 hover:bg-muted/50"
            onClick={() => handlePlayPreset(preset.id)}
            disabled={loading}
          >
            <div className="flex items-center mb-2 w-full">
              <div className="mr-2 text-primary">{preset.icon}</div>
              <div className="font-medium">{preset.name}</div>
            </div>
            <p className="text-xs text-muted-foreground text-left">
              {preset.description}
            </p>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecommendedPresets;
