
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMusicalCreation } from '@/hooks/useMusicalCreation';
import { useMusic } from '@/contexts/MusicContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PlayCircle, Clock, Music2, AlertCircle, Loader2 } from 'lucide-react';
import { MusicCreation } from '@/services/music/music-generator-service';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const StatusBadge = ({ status }: { status: MusicCreation['status'] }) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          En attente
        </Badge>
      );
    case 'processing':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          En cours
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Music2 className="h-3 w-3 mr-1" />
          Terminé
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Échec
        </Badge>
      );
    default:
      return null;
  }
};

const CreationsList = () => {
  const { loadUserCreations, creations, isLoading, setCurrentCreation } = useMusicalCreation();
  const { openDrawer } = useMusic();
  
  useEffect(() => {
    loadUserCreations();
  }, [loadUserCreations]);
  
  const handlePlayCreation = (creation: MusicCreation) => {
    // Set the current creation in the state for the current track
    if (creation.audioUrl) {
      setCurrentCreation(creation);
      
      // Using the existing player infrastructure, create a track
      const track = {
        id: creation.id,
        title: creation.title,
        artist: 'Ma création',
        duration: 180, // Default duration
        url: creation.audioUrl,
        cover: ''
      };
      
      // Open the drawer and play the track (assuming MusicContext has these functions)
      openDrawer();
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  if (creations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Music2 className="h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-1">Aucune création</h3>
          <p className="text-muted-foreground mb-4">
            Créez votre première composition musicale personnalisée
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes créations musicales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {creations.map((creation) => (
            <div 
              key={creation.id}
              className={cn(
                "border rounded-lg p-4 flex flex-col space-y-4 transition-all",
                creation.status === 'completed' ? "hover:shadow-md cursor-pointer" : ""
              )}
              onClick={() => creation.status === 'completed' && handlePlayCreation(creation)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{creation.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {creation.prompt}
                  </p>
                </div>
                <StatusBadge status={creation.status} />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  {format(new Date(creation.createdAt), "d MMMM yyyy", { locale: fr })}
                </div>
                
                {creation.status === 'completed' && creation.audioUrl && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayCreation(creation);
                    }}
                  >
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Écouter
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CreationsList;
