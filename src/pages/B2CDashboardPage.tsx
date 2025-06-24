
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const B2CDashboardPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard Personnel</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan Émotionnel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analysez votre état émotionnel actuel
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Journal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Suivez votre évolution émotionnelle
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Coach IA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Obtenez des conseils personnalisés
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
