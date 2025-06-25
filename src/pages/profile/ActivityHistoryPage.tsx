import React from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const ActivityHistoryPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Historique d'Activité</h1>
              <p className="text-muted-foreground">Consultez votre parcours émotionnel</p>
            </div>
            <Badge variant="secondary">En développement</Badge>
          </div>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" /> Historique d'Activité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Cette page est en cours de développement. 
                Retrouvez vos actions passées sur la plateforme.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Journal d'activités</h3>
                  <p className="text-sm text-muted-foreground">À implémenter</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Statistiques d'usage</h3>
                  <p className="text-sm text-muted-foreground">À implémenter</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Progression temporelle</h3>
                  <p className="text-sm text-muted-foreground">À implémenter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </UnifiedShell>
    </div>
  );
};

export default ActivityHistoryPage;
