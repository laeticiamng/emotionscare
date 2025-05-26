
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan, Camera } from 'lucide-react';

const B2CScan: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Scan Émotionnel</h1>
        <p className="text-muted-foreground">
          Analysez votre état émotionnel en temps réel
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              <CardTitle>Scanner votre émotion</CardTitle>
            </div>
            <CardDescription>
              Utilisez votre caméra pour analyser votre état émotionnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Camera className="h-16 w-16 mx-auto mb-6 text-primary" />
              <Button size="lg" className="mb-4">
                <Camera className="h-4 w-4 mr-2" />
                Démarrer le scan
              </Button>
              <p className="text-sm text-muted-foreground">
                Assurez-vous d'être dans un endroit bien éclairé
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CScan;
