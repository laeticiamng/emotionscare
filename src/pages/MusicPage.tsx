
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, SkipForward } from 'lucide-react';

const MusicPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Music className="h-8 w-8 text-purple-600" />
            Musicothérapie
          </h1>
          <p className="text-lg text-muted-foreground">
            Musique thérapeutique adaptée à votre état émotionnel
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lecture en cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-400 to-blue-500 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <Music className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Relaxation Océanique</h3>
              <p className="text-muted-foreground mb-4">Sons de la nature - 8:32</p>
              <div className="flex justify-center gap-4">
                <Button size="icon" variant="outline">
                  <SkipForward className="h-4 w-4 rotate-180" />
                </Button>
                <Button size="icon">
                  <Play className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Relaxation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Musiques apaisantes pour la détente</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Concentration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Sons pour améliorer la focus</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Méditation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Ambiances pour la méditation</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
