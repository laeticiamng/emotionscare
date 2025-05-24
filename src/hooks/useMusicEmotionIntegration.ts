import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useMusic } from '@/hooks/useMusic';
import { EmotionMusicParams, MusicPlaylist } from '@/types/music';
import { ApiErrorHandler } from '@/utils/errorHandlers';

interface AppError extends Error {
  code?: string;
  status?: number;
  details?: any;
}

const validateEmotionParams = (params: EmotionMusicParams): boolean => {
  if (!params || typeof params !== 'object') {
    throw new Error('Paramètres invalides');
  }
  if (!params.emotion || typeof params.emotion !== 'string') {
    throw new Error('Émotion manquante ou invalide');
  }
  if (params.intensity !== undefined && (typeof params.intensity !== 'number' || params.intensity < 0 || params.intensity > 1)) {
    throw new Error('Intensité invalide (doit être entre 0 et 1)');
  }
  return true;
};

const classifyError = (error: any): AppError => {
  const appError: AppError = new Error();
  
  if (error?.status >= 500) {
    appError.message = 'Service temporairement indisponible';
    appError.code = 'SERVICE_ERROR';
  } else if (error?.status === 404) {
    appError.message = 'Fonctionnalité en développement';
    appError.code = 'NOT_FOUND';
  } else if (error?.status === 401) {
    appError.message = 'Authentification requise';
    appError.code = 'AUTH_ERROR';
  } else if (error?.message?.includes('timeout')) {
    appError.message = 'Délai de connexion dépassé';
    appError.code = 'TIMEOUT';
  } else {
    appError.message = 'Erreur lors du chargement de la musique';
    appError.code = 'UNKNOWN';
  }
  
  appError.status = error?.status;
  appError.details = error;
  return appError;
};

/**
 * Hook pour intégrer les émotions détectées avec les recommandations musicales
 */
export const useMusicEmotionIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const music = useMusic();

  const activateMusicForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      // Validation des paramètres d'entrée
      validateEmotionParams(params);
      
      setIsLoading(true);
      console.log('[Music Integration] Activation for emotion:', params);

      if (!music.loadPlaylistForEmotion) {
        throw new Error('Service musical non disponible');
      }

      const result = await music.loadPlaylistForEmotion(params.emotion);
      
      if (result) {
        toast({
          title: "Musique activée",
          description: `Playlist adaptée à votre état : ${params.emotion}`,
        });
      }

      return result || null;
    } catch (error: any) {
      console.error('[Music Integration] Error:', error);
      const classifiedError = classifyError(error);
      
      toast({
        title: "Erreur musique",
        description: classifiedError.message,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getEmotionMusicDescription = (emotion: string): string => {
    const descriptions: Record<string, string> = {
      'happy': 'Musiques énergiques pour amplifier votre joie',
      'calm': 'Mélodies apaisantes pour maintenir votre sérénité',
      'focused': 'Sons de concentration pour optimiser votre productivité',
      'sad': 'Musiques réconfortantes pour vous accompagner',
      'excited': 'Rythmes dynamiques pour accompagner votre énergie',
      'relaxed': 'Ambiances douces pour prolonger votre détente',
      'default': 'Musique personnalisée pour votre bien-être'
    };

    return descriptions[emotion.toLowerCase()] || descriptions['default'];
  };

  return {
    activateMusicForEmotion,
    getEmotionMusicDescription,
    isLoading
  };
};
