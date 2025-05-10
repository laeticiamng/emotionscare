import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionalTeamViewProps } from '@/types';

const EmotionalTeamView: React.FC<EmotionalTeamViewProps> = ({ className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>État émotionnel de l'équipe</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Visualisation de l'état émotionnel de l'équipe en temps réel.</p>
        {/* Team emotional state visualization would go here */}
      </CardContent>
    </Card>
  );
};

export default EmotionalTeamView;
