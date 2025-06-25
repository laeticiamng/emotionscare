import React from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Centre de Notifications</h1>
              <p className="text-muted-foreground">Gérez toutes vos notifications</p>
            </div>
            <Badge variant="secondary">En développement</Badge>
          </div>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Cette page est en cours de développement. 
                Consultez et paramétrez vos alertes.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Liste des notifications</h3>
                  <p className="text-sm text-muted-foreground">À implémenter</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Paramètres d'alerte</h3>
                  <p className="text-sm text-muted-foreground">À implémenter</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Historique des messages</h3>
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

export default NotificationsPage;
