
import { useState, useCallback } from 'react';
import { EmotionResult, EmotionRecommendation } from '@/types/emotion';
import { v4 as uuidv4 } from 'uuid';

export function useScanPage() {
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<EmotionRecommendation[]>([
    {
      id: uuidv4(),
      type: 'activity',
      title: 'Respiration profonde',
      description: 'Exercice de respiration pour vous aider à vous recentrer',
      emotion: 'calm',
      content: 'Pratiquez 5 respirations profondes en comptant jusqu\'à 4 à l\'inspiration et jusqu\'à 6 à l\'expiration.',
      category: 'mindfulness'
    },
    {
      id: uuidv4(),
      type: 'music',
      title: 'Playlist Relaxante',
      description: 'Une sélection musicale pour retrouver votre calme',
      emotion: 'calm',
      content: 'Écoutez notre playlist spéciale relaxation pour vous aider à vous détendre.',
      category: 'music'
    }
  ]);
  
  const [alternativeRecommendations, setAlternativeRecommendations] = useState<EmotionRecommendation[]>([
    {
      id: uuidv4(),
      type: 'journal',
      title: 'Écriture libre',
      description: 'Écrivez librement vos pensées pendant 5 minutes',
      emotion: 'mixed',
      content: 'Prenez quelques minutes pour écrire tout ce qui vous passe par la tête, sans jugement.',
      category: 'reflection'
    },
    {
      id: uuidv4(),
      type: 'activity',
      title: 'Marche en pleine conscience',
      description: 'Une courte marche méditative pour vous reconnecter au moment présent',
      emotion: 'mixed',
      content: 'Prenez 10 minutes pour marcher lentement en étant pleinement conscient de chaque pas et sensation.',
      category: 'mindfulness'
    }
  ]);
  
  const handleScanComplete = useCallback((result: EmotionResult) => {
    setCurrentEmotion(result.emotion);
    
    // En situation réelle, on utiliserait result.emotion pour déterminer les recommandations appropriées
    console.log('Scan complété avec émotion:', result.emotion);
  }, []);
  
  return {
    currentEmotion,
    recommendations,
    alternativeRecommendations,
    handleScanComplete
  };
}

export default useScanPage;
