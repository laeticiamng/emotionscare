import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const VRWeeklyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Statistiques Hebdomadaires - VR
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Aperçu des sessions VR</CardTitle>
          <CardDescription>
            Visualisez vos données de réalité virtuelle de la semaine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            🥽 Page en cours de développement
            <br />
            Connexion API: /api/vr/weekly-user
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VRWeeklyPage;