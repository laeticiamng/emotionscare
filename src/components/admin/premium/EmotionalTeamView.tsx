
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionalTeamViewProps } from '@/types/emotion';

const EmotionalTeamView: React.FC<EmotionalTeamViewProps> = ({ userId, period, teamId, className, onRefresh }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>État émotionnel de l'équipe</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Visualisation de l'état émotionnel de l'équipe en temps réel.</p>
        <p>Identifiant d'équipe: {teamId || userId}</p>
        {period && <p>Période: {period}</p>}
        {/* Team emotional state visualization would go here */}
      </CardContent>
    </Card>
  );
};

export default EmotionalTeamView;
