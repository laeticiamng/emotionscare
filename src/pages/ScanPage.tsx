
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Mic, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ScanPage: React.FC = () => {
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
          <h1 className="text-3xl font-bold mb-4">Scanner Émotionnel</h1>
          <p className="text-lg text-muted-foreground">
            Analysez votre état émotionnel en temps réel
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Camera className="mx-auto mb-4 h-12 w-12 text-blue-500" />
              <CardTitle>Scan Visuel</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Utilisez votre caméra pour analyser vos expressions faciales
                et détecter votre état émotionnel.
              </p>
              <Button className="w-full">
                Démarrer le scan visuel
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Mic className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <CardTitle>Scan Vocal</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Analysez votre voix pour détecter les variations émotionnelles
                et les niveaux de stress.
              </p>
              <Button className="w-full" variant="outline">
                Démarrer le scan vocal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
