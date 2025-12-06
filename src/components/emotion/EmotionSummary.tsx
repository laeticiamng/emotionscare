
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface EmotionData {
  date: string;
  emotion: string;
  intensity: number;
  notes?: string;
}

interface EmotionSummaryProps {
  data: EmotionData[];
}

const EmotionSummary: React.FC<EmotionSummaryProps> = ({ data }) => {
  // Calculate frequency of each emotion
  const emotionCounts: Record<string, number> = {};
  data.forEach((item) => {
    emotionCounts[item.emotion] = (emotionCounts[item.emotion] || 0) + 1;
  });
  
  // Calculate average intensity
  const avgIntensity = data.reduce((acc, item) => acc + item.intensity, 0) / data.length;
  
  // Find most common emotion
  let mostCommonEmotion = '';
  let highestCount = 0;
  
  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    if (count > highestCount) {
      mostCommonEmotion = emotion;
      highestCount = count;
    }
  });
  
  // Get emotion color
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'sad':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'anxious':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
      case 'calm':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'frustrated':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col items-center p-4 bg-card rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Émotion dominante</h3>
        <Badge className={`text-lg ${getEmotionColor(mostCommonEmotion)} capitalize`}>
          {mostCommonEmotion}
        </Badge>
        <p className="text-xs text-muted-foreground mt-2">
          {Math.round((highestCount / data.length) * 100)}% du temps
        </p>
      </div>
      
      <div className="flex flex-col items-center p-4 bg-card rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Intensité moyenne</h3>
        <div className="text-3xl font-bold">{avgIntensity.toFixed(1)}</div>
        <p className="text-xs text-muted-foreground mt-2">Sur une échelle de 1 à 10</p>
      </div>
      
      <div className="flex flex-col items-center p-4 bg-card rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Jours enregistrés</h3>
        <div className="text-3xl font-bold">{data.length}</div>
        <p className="text-xs text-muted-foreground mt-2">Ce mois-ci</p>
      </div>
      
      <div className="md:col-span-3 mt-4">
        <h3 className="text-sm font-medium mb-2">Émotions enregistrées</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(emotionCounts).map(([emotion, count]) => (
            <Badge key={emotion} className={`${getEmotionColor(emotion)} capitalize`}>
              {emotion}: {count}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionSummary;
