import React from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';

const AmbitionArcadePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Ambition Arcade</h1>
              <p className="text-muted-foreground">Transformez vos objectifs en jeu motivant</p>
            </div>
            <Badge variant="secondary">En développement</Badge>
          </div>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" /> Ambition Arcade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Cette page est en cours de développement. 
                Gamifiez votre progression pour booster la motivation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Définition d'objectifs</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Créez des objectifs SMART personnalisés avec gamification
                    </p>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Objectifs personnalisables</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Créer un objectif
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Système de progression</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Suivi visuel de vos progrès avec récompenses automatiques
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-3/4"></div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Voir progression
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Récompenses d'ambition</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Badges, points et déblocables selon vos accomplissements
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Mes récompenses
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

export default AmbitionArcadePage;
