import React from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

const AccountDeletionPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Suppression de Compte</h1>
              <p className="text-muted-foreground">Supprimez définitivement votre compte</p>
            </div>
            <Badge variant="secondary">En développement</Badge>
          </div>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" /> Suppression de Compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Cette page est en cours de développement. 
                Lancez le processus de suppression de manière sécurisée.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Processus de suppression</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Processus sécurisé en 3 étapes avec période de grâce
                    </p>
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="text-xs text-muted-foreground">Suppression différée</span>
                    </div>
                    <Button size="sm" variant="destructive" className="w-full">
                      Démarrer suppression
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Sauvegarde préalable</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Exportez vos données avant la suppression définitive
                    </p>
                    <div className="text-center">
                      <Badge variant="secondary" className="text-xs">Export JSON/CSV</Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Exporter données
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Confirmation sécurisée</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Double authentification et délai de réflexion obligatoire
                    </p>
                    <div className="text-center">
                      <Badge variant="outline" className="text-xs">⏱ 7 jours</Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Annuler suppression
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

export default AccountDeletionPage;
