
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import EnhancedMusicVisualizer from '@/components/music/EnhancedMusicVisualizer';
import { Sparkles } from 'lucide-react';

const PlayerTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lecteur musical</CardTitle>
        <CardDescription>Écoutez de la musique adaptée à votre état émotionnel</CardDescription>
      </CardHeader>
      <CardContent>
        <EnhancedMusicVisualizer 
          showControls={true}
          height={200}
          className="mb-4"
        />
        
        <Card className="bg-muted/20 p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium">Musique adaptative</h3>
              <p className="text-sm text-muted-foreground">
                La musique s'adapte automatiquement à votre état émotionnel détecté lors des scans
              </p>
            </div>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PlayerTab;
