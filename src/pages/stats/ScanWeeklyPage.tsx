import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ScanWeeklyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Statistiques Hebdomadaires - Scan Émotionnel
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Aperçu des analyses émotionnelles</CardTitle>
          <CardDescription>
            Visualisez vos données de scan émotionnel de la semaine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            🎭 Page en cours de développement
            <br />
            Connexion API: /api/scan/weekly-user
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanWeeklyPage;