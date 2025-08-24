import React from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera } from 'lucide-react';

const ARFiltersPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Filtres AR Émotionnels</h1>
              <p className="text-muted-foreground">Visualisez vos émotions en réalité augmentée</p>
            </div>
            <Badge variant="secondary">En développement</Badge>
          </div>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" /> Filtres AR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Cette page est en cours de développement. 
                Appliquez des filtres interactifs selon votre humeur.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Détection faciale émotionnelle</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Reconnaissance des émotions via l'analyse faciale en temps réel
                    </p>
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Algorithme IA avancé</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Tester la détection
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Filtres interactifs</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Filtres AR adaptatifs selon votre état émotionnel
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">Joie</Badge>
                      <Badge variant="secondary" className="text-xs">Calme</Badge>
                      <Badge variant="secondary" className="text-xs">Énergie</Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Voir les filtres
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Capture d'humeur</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Enregistrez votre humeur avec un filtre personnalisé
                    </p>
                    <div className="text-center">
                      <Star className="h-6 w-6 text-primary mx-auto mb-1" />
                      <span className="text-xs text-muted-foreground">Moments précieux</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Capturer maintenant
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </UnifiedShell>
    </div>
  );
};

export default ARFiltersPage;
