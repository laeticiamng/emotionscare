
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Headphones, Heart } from 'lucide-react';

const B2BUserMusicPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Thérapie Musicale</h1>
          <p className="text-muted-foreground">Musique thérapeutique adaptée à votre état émotionnel</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Music className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>Relaxation</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Musiques apaisantes pour la détente
              </p>
              <Button className="w-full flex items-center gap-2">
                <Play className="h-4 w-4" />
                Écouter
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Headphones className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Concentration</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Sons pour améliorer la focus
              </p>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Play className="h-4 w-4" />
                Écouter
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle>Bien-être</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Mélodies pour le bien-être général
              </p>
              <Button variant="secondary" className="w-full flex items-center gap-2">
                <Play className="h-4 w-4" />
                Écouter
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Playlists personnalisées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Vos playlists personnalisées apparaîtront ici après votre première session
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserMusicPage;
