
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan, Camera, Mic } from 'lucide-react';

const ScanPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Scan className="h-8 w-8 text-blue-600" />
            Scanner Émotionnel
          </h1>
          <p className="text-lg text-muted-foreground">
            Analysez votre état émotionnel en temps réel
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Scan Visuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Utilisez votre caméra pour analyser vos expressions faciales
              </p>
              <Button className="w-full">Démarrer le scan visuel</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Scan Vocal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Analysez le ton et l'émotion dans votre voix
              </p>
              <Button className="w-full">Démarrer le scan vocal</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
