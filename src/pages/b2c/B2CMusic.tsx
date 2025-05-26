
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const B2CMusic: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Musique Thérapeutique</h1>
        <p className="text-muted-foreground">
          Découvrez des playlists adaptées à votre état émotionnel
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              <CardTitle>Lecteur de musique</CardTitle>
            </div>
            <CardDescription>
              Musique personnalisée selon votre humeur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Music className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h3 className="text-lg font-semibold mb-4">Aucune musique en cours</h3>
              <div className="flex justify-center gap-2 mb-4">
                <Button variant="outline" size="icon">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button size="icon">
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Sélectionnez une playlist pour commencer
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CMusic;
