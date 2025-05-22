
import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AudioPage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Thérapie Audio</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Enregistrements Audio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Enregistrez votre voix pour analyser votre état émotionnel.
              </p>
              <div className="h-40 flex items-center justify-center border-2 border-dashed rounded-md">
                <p className="text-center text-muted-foreground">
                  L'interface d'enregistrement audio sera affichée ici.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Analyse Émotionnelle Vocale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Visualisez les émotions détectées dans votre voix.
              </p>
              <div className="h-40 flex items-center justify-center border-2 border-dashed rounded-md">
                <p className="text-center text-muted-foreground">
                  Les résultats d'analyse s'afficheront ici après un enregistrement.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
};

export default AudioPage;
