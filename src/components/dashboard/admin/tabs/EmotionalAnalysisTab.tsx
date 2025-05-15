
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const EmotionalAnalysisTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyse émotionnelle de l'équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ce module affichera les analyses émotionnelles détaillées de l'équipe.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionalAnalysisTab;
