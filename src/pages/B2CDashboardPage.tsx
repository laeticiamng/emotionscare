
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const B2CDashboardPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card data-testid="emotion-scan-card">
          <CardHeader>
            <CardTitle>Scan Émotionnel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Analysez votre état émotionnel actuel
            </p>
          </CardContent>
        </Card>
        
        <Card data-testid="journal-card">
          <CardHeader>
            <CardTitle>Journal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Tenez un journal de vos émotions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Musique</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Écoutez de la musique adaptée à votre humeur
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
