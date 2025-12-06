
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Save, Share, Download, ArrowRight } from 'lucide-react';

interface EmotionScanResultProps {
  result: EmotionResult;
  onSave?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onContinue?: () => void;
  showActions?: boolean;
}

// Fonction utilitaire pour formater la date
const formatResultDate = (result: EmotionResult): string => {
  try {
    // Utiliser date si disponible, sinon utiliser timestamp
    const dateString = result.date || result.timestamp;
    if (!dateString) return 'Date inconnue';

    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
};

// Mapper les émotions à des couleurs
const getEmotionColor = (emotion: string): string => {
  const emotionColors: Record<string, string> = {
    happy: 'bg-green-100 text-green-800',
    sad: 'bg-blue-100 text-blue-800',
    angry: 'bg-red-100 text-red-800',
    anxious: 'bg-yellow-100 text-yellow-800',
    neutral: 'bg-gray-100 text-gray-800',
    surprised: 'bg-purple-100 text-purple-800',
    fearful: 'bg-orange-100 text-orange-800',
    disgusted: 'bg-emerald-100 text-emerald-800',
    calm: 'bg-sky-100 text-sky-800',
    excited: 'bg-pink-100 text-pink-800',
    love: 'bg-red-100 text-red-800',
    thoughtful: 'bg-indigo-100 text-indigo-800',
    confused: 'bg-amber-100 text-amber-800',
  };

  return emotionColors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Fonction pour obtenir un pourcentage arrondi à partir du niveau de confiance
const getConfidencePercentage = (confidence: number): number => {
  return Math.round(confidence * 100);
};

const EmotionScanResult: React.FC<EmotionScanResultProps> = ({
  result,
  onSave,
  onShare,
  onDownload,
  onContinue,
  showActions = true,
}) => {
  // Déterminer l'émotion principale
  const mainEmotion = result.primaryEmotion || result.emotion || 'neutral';
  const confidencePercentage = getConfidencePercentage(result.confidence || result.score || 0.5);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Résultat de votre scan émotionnel</CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatResultDate(result)}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Émotion principale */}
        <div className="text-center py-4">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getEmotionColor(mainEmotion)}`}>
            {mainEmotion.charAt(0).toUpperCase() + mainEmotion.slice(1)}
          </span>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${confidencePercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Confiance: {confidencePercentage}%
            </p>
          </div>
        </div>

        {/* Émotions secondaires */}
        {result.secondaryEmotions && result.secondaryEmotions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Émotions secondaires</h4>
            <div className="flex flex-wrap gap-2">
              {result.secondaryEmotions.map((emotion) => (
                <span 
                  key={emotion}
                  className={`px-3 py-1 rounded-full text-xs ${getEmotionColor(emotion)}`}
                >
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Source du scan */}
        <div>
          <h4 className="text-sm font-medium mb-1">Source</h4>
          <p className="text-sm">{result.source === 'facial' ? 'Expression faciale' : 
              result.source === 'voice' ? 'Voix' : 
              result.source === 'text' ? 'Texte' : 
              result.source === 'emoji' ? 'Emoji sélectionné' : 'Autre'}</p>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-2 pt-4">
            {onSave && (
              <Button variant="outline" size="sm" onClick={onSave}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            )}
            {onShare && (
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share className="mr-2 h-4 w-4" />
                Partager
              </Button>
            )}
            {onDownload && (
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            )}
            {onContinue && (
              <Button className="ml-auto" onClick={onContinue}>
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionScanResult;
