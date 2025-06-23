
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const MusicPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Musicothérapie</h1>
          <p className="text-lg text-muted-foreground">
            Musique adaptée à votre état émotionnel
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Music className="mx-auto mb-4 h-12 w-12 text-blue-500" />
              <CardTitle>Relaxation</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Musiques douces pour se détendre et réduire le stress.
              </p>
              <Button className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Écouter
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Heart className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <CardTitle>Motivation</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Musiques énergisantes pour booster votre moral.
              </p>
              <Button className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Écouter
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Music className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <CardTitle>Concentration</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Musiques d'ambiance pour améliorer la concentration.
              </p>
              <Button className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Écouter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
