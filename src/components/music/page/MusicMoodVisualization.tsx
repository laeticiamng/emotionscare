// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface MusicMoodVisualizationProps {
  mood: string;
  intensity?: number;
}

const MusicMoodVisualization: React.FC<MusicMoodVisualizationProps> = ({ mood, intensity = 0.5 }) => {
  // Définir différents styles selon l'humeur
  const getMoodColor = () => {
    switch (mood.toLowerCase()) {
      case 'calm':
        return 'bg-blue-50 dark:bg-blue-950';
      case 'energetic':
        return 'bg-orange-50 dark:bg-orange-950';
      case 'focused':
        return 'bg-purple-50 dark:bg-purple-950';
      case 'happy':
        return 'bg-yellow-50 dark:bg-yellow-950';
      case 'relaxed':
        return 'bg-green-50 dark:bg-green-950';
      case 'sad':
        return 'bg-indigo-50 dark:bg-indigo-950';
      default:
        return 'bg-gray-50 dark:bg-gray-900';
    }
  };

  const getWaveColor = () => {
    switch (mood.toLowerCase()) {
      case 'calm':
        return '#3b82f6';
      case 'energetic':
        return '#f97316';
      case 'focused':
        return '#8b5cf6';
      case 'happy':
        return '#eab308';
      case 'relaxed':
        return '#10b981';
      case 'sad':
        return '#6366f1';
      default:
        return '#64748b';
    }
  };

  // Générer un pattern de visualisation simple pour l'humeur
  const generateVisualizationBars = () => {
    const numBars = 20;
    const waveColor = getWaveColor();
    
    return (
      <div className="flex items-end justify-center h-24 space-x-1">
        {Array.from({ length: numBars }).map((_, i) => {
          // Créer une forme d'onde qui ressemble à l'humeur
          // Par exemple, une onde calme aurait des hauteurs plus régulières
          let height;
          
          if (mood.toLowerCase() === 'calm') {
            // Onde plus régulière pour calme
            height = 30 + Math.sin(i * 0.5) * 20 * intensity;
          } else if (mood.toLowerCase() === 'energetic') {
            // Onde plus chaotique pour énergique
            height = 20 + Math.random() * 60 * intensity;
          } else if (mood.toLowerCase() === 'focused') {
            // Onde avec des pics réguliers pour concentré
            height = 30 + Math.cos(i * 0.8) * 30 * intensity;
          } else {
            // Onde par défaut
            height = 10 + Math.sin(i * 0.7) * 40 * intensity;
          }
          
          return (
            <div 
              key={i}
              style={{ 
                height: `${height}px`,
                backgroundColor: waveColor,
                opacity: 0.7 + Math.random() * 0.3
              }}
              className="w-2 rounded-md"
            />
          );
        })}
      </div>
    );
  };

  return (
    <Card className={`${getMoodColor()} transition-all duration-500`}>
      <CardHeader>
        <CardTitle className="capitalize">{mood}</CardTitle>
      </CardHeader>
      <CardContent>
        {generateVisualizationBars()}
        <div className="mt-4 text-sm text-center text-muted-foreground">
          {mood === 'calm' && "Ondes cérébrales détendues, fréquence entre 8-12 Hz"}
          {mood === 'energetic' && "Rythme cardiaque élevé, activité neuronale rapide"}
          {mood === 'focused' && "Attention concentrée, ondes beta modérées"}
          {mood === 'happy' && "Dopamine et sérotonine élevées"}
          {mood === 'relaxed' && "Respiration ralentie, pression artérielle réduite"}
          {mood === 'sad' && "Activité préfrontale asymétrique"}
          {!['calm', 'energetic', 'focused', 'happy', 'relaxed', 'sad'].includes(mood.toLowerCase()) && 
            "Visualisation personnalisée de l'état émotionnel"}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicMoodVisualization;
