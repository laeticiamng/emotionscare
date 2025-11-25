// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, Download, Music, Play, Share2, User } from 'lucide-react';
import { toast } from 'sonner';
import { emotionsApi } from '@/services/api/scansApi';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

interface EmotionResultCardProps {
  result: EmotionResult;
  onPlayAudio?: () => void;
  onClose?: () => void;
  onSave?: () => void;
}

const EmotionResultCard: React.FC<EmotionResultCardProps> = ({
  result,
  onPlayAudio,
  onClose,
  onSave
}) => {
  const { user } = useAuth();
  const date = new Date(result.date);
  const formattedDate = formatDistanceToNow(date, { addSuffix: true, locale: fr });

  // Define score styles
  let scoreColor = 'text-amber-500';
  let scoreBg = 'bg-amber-100';
  let scoreText = 'Neutre';
  
  if (result.score >= 75) {
    scoreColor = 'text-green-600';
    scoreBg = 'bg-green-100';
    scoreText = 'Positif';
  } else if (result.score <= 35) {
    scoreColor = 'text-red-600';
    scoreBg = 'bg-red-100';
    scoreText = 'Négatif';
  } else if (result.score < 75 && result.score > 50) {
    scoreColor = 'text-blue-600';
    scoreBg = 'bg-blue-100';
    scoreText = 'Plutôt positif';
  } else if (result.score <= 50 && result.score > 35) {
    scoreColor = 'text-orange-600';
    scoreBg = 'bg-orange-100';
    scoreText = 'Plutôt négatif';
  }

  const handleSave = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour sauvegarder des résultats');
      return;
    }

    try {
      await emotionsApi.create({
        emojis: result.emojis,
        primary_emotion: result.primary_emotion || result.emotion,
        score: result.score,
        intensity: result.intensity,
        text: result.text,
        source: result.source || 'result_card',
        ai_feedback: result.ai_feedback,
      });

      toast.success('Résultat sauvegardé avec succès');
      if (onSave) onSave();
    } catch (error) {
      logger.error('Failed to save emotion result', error as Error, 'UI');
      toast.error('Erreur lors de la sauvegarde du résultat');
    }
  };

  const handleShare = () => {
    // Implement sharing functionality, e.g., copy to clipboard
    const shareText = `Mon niveau de bien-être émotionnel est de ${result.score}/100 - ${scoreText}`;
    
    navigator.clipboard.writeText(shareText)
      .then(() => toast.success('Texte copié dans le presse-papier'))
      .catch(() => toast.error('Impossible de copier le texte'));
  };

  const getEmotionIcon = () => {
    if (result.emojis) {
      return <div className="text-2xl">{result.emojis}</div>;
    } else if (result.audio_url) {
      return <Play className="h-6 w-6 text-blue-500" />;
    } else {
      return <User className="h-6 w-6 text-purple-500" />;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {getEmotionIcon()}
              Analyse d'émotions
            </CardTitle>
            <CardDescription>
              {formattedDate}
            </CardDescription>
          </div>
          <div className={`${scoreBg} ${scoreColor} px-3 py-1 rounded-full font-medium`}>
            {result.score}/100 - {scoreText}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {result.text && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Texte analysé:</h4>
            <p className="text-gray-800 dark:text-gray-200">{result.text}</p>
          </div>
        )}
        
        {result.emojis && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Émojis choisis:</h4>
            <p className="text-2xl">{result.emojis}</p>
          </div>
        )}
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Analyse AI:</h4>
          <p className="text-gray-800 dark:text-gray-200">{result.ai_feedback}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {result.audio_url && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onPlayAudio}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Écouter l'audio
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Sauvegarder
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Partager
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 ml-auto"
            onClick={() => {
              toast.success('Génération de musique initiée');
              if (onClose) onClose();
            }}
          >
            <Music className="h-4 w-4" />
            Générer une musique adaptée
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionResultCard;
