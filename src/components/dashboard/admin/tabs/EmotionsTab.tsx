
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

const EmotionsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse des émotions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">
          Données d'analyse émotionnelle - à implémenter
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionsTab;
