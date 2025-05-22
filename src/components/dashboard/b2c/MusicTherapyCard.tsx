
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MusicTherapyCardProps {
  className?: string;
}

const MusicTherapyCard: React.FC<MusicTherapyCardProps> = ({ className = '' }) => {
  const handlePlay = () => {
    toast('Lancement de la thérapie musicale');
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Thérapie musicale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-md p-4 mb-4 flex items-center">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Volume2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Méditation guidée</h3>
            <p className="text-sm text-muted-foreground">12 minutes</p>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 mt-4">
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            className="rounded-full h-12 w-12 bg-primary"
            onClick={handlePlay}
          >
            <Play className="h-6 w-6 text-primary-foreground" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground text-center">
            Musique adaptée à votre état émotionnel actuel
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicTherapyCard;
