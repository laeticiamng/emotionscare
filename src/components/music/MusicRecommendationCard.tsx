
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones, Music } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { cn } from '@/lib/utils';

interface MusicRecommendationCardProps {
  emotion: string;
  intensity?: number;
  standalone?: boolean;
  className?: string;
}

const MusicRecommendationCard: React.FC<MusicRecommendationCardProps> = ({
  emotion,
  intensity = 50,
  standalone = false,
  className
}) => {
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();
  
  const handlePlay = async () => {
    await loadPlaylistForEmotion(emotion);
    setOpenDrawer(true);
  };
  
  return (
    <Card className={cn(standalone ? 'border-2 border-primary/20' : '', className)}>
      {standalone && (
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Music className="mr-2 h-5 w-5" />
            Recommandation musicale
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Musique pour état "{emotion}"</h4>
            <p className="text-sm text-muted-foreground">
              Playlist adaptée à votre humeur actuelle
            </p>
          </div>
          <Button onClick={handlePlay} className="flex items-center gap-2">
            <Headphones className="h-4 w-4" />
            Écouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendationCard;
