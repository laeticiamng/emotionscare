
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan, Camera, Mic } from 'lucide-react';

const B2BUserScanPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Scan Émotionnel</h1>
          <p className="text-muted-foreground">Analysez votre état émotionnel actuel</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="text-center">
              <Camera className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Analyse Faciale</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Utilisez votre caméra pour analyser vos expressions faciales
              </p>
              <Button className="w-full">
                Commencer l'analyse
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Mic className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Analyse Vocale</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Analysez votre état émotionnel à travers votre voix
              </p>
              <Button variant="outline" className="w-full">
                Enregistrer un échantillon
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-6 w-6" />
              Historique des analyses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Aucune analyse effectuée pour le moment
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserScanPage;
