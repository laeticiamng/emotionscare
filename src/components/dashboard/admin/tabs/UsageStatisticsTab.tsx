
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const UsageStatisticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Statistiques d'utilisation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Affiche les statistiques d'utilisation de la plateforme.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageStatisticsTab;
