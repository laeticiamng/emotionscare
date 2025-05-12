
import { useState } from 'react';

// Interface pour les paramètres envoyés vers le service de musique
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  // Nous retirons la propriété 'confidence' car elle n'est pas utilisée
}

// Descriptions des musiques par émotion
const musicDescriptions: Record<string, string> = {
  happy: "Des mélodies joyeuses et dynamiques pour amplifier votre bonne humeur.",
  sad: "Des compositions apaisantes qui vous aideront à traverser ce moment difficile.",
  angry: "De la musique équilibrante pour canaliser votre énergie et retrouver le calme.",
  anxious: "Des sonorités douces et relaxantes pour apaiser votre anxiété.",
  calm: "Des ambiances paisibles pour maintenir votre état de sérénité.",
  excited: "Des rythmes entraînants pour accompagner votre enthousiasme.",
  neutral: "Une sélection équilibrée adaptée à votre humeur neutre.",
};

export const useMusicEmotionIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastPlayedEmotion, setLastPlayedEmotion] = useState<string | null>(null);

  // Fonction pour activer la musique correspondante à l'émotion
  const activateMusicForEmotion = async (params: EmotionMusicParams): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulation de l'appel API - à remplacer par un vrai appel API
      console.log(`Activating music for emotion: ${params.emotion} with intensity: ${params.intensity}`);
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLastPlayedEmotion(params.emotion);
      return true;
    } catch (error) {
      console.error("Error activating music for emotion:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Obtenir la description de la musique pour une émotion
  const getEmotionMusicDescription = (emotion: string): string => {
    return musicDescriptions[emotion.toLowerCase()] || 
      "Une musique spécialement sélectionnée pour s'accorder à votre état émotionnel actuel.";
  };

  return {
    activateMusicForEmotion,
    getEmotionMusicDescription,
    isLoading,
    lastPlayedEmotion
  };
};
