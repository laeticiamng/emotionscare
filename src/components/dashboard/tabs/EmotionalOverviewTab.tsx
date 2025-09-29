
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface EmotionalOverviewTabProps {
  className?: string;
}

const EmotionalOverviewTab: React.FC<EmotionalOverviewTabProps> = ({ className }) => {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Aperçu émotionnel</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenu de l'aperçu émotionnel à venir.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionalOverviewTab;
