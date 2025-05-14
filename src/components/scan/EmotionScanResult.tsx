
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmotionResult } from '@/types';
import { useNavigate } from 'react-router-dom';
import { getEmotionIcon } from '@/lib/emotionUtils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Share2, Download } from 'lucide-react';
import LiveEmotionResult from './live/EmotionResult';

interface EmotionScanResultProps {
  result: EmotionResult;
  onSaveResult?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onShowCoaching?: () => void;
  showActions?: boolean;
}

const EmotionScanResult: React.FC<EmotionScanResultProps> = ({
  result,
  onSaveResult,
  onShare,
  onDownload,
  onShowCoaching,
  showActions = true
}) => {
  const navigate = useNavigate();
  
  // Get the emotion icon based on the detected emotion
  const EmotionIcon = getEmotionIcon(result.emotion);
  
  // Format the timestamp if available
  const formattedTime = result.date 
    ? formatDistanceToNow(new Date(result.date), { addSuffix: true, locale: fr })
    : 'À l\'instant';
  
  // Format confidence as percentage
  const confidencePercentage = result.confidence 
    ? `${Math.round(result.confidence * 100)}%` 
    : 'N/A';
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="mr-3">
            {EmotionIcon && <EmotionIcon size={24} />}
          </div>
          <div>
            Résultat de l'analyse émotionnelle
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Live result component */}
        <LiveEmotionResult 
          emotion={result.emotion} 
          confidence={result.confidence || 0} 
          transcript={result.text || result.transcript}
        />
        
        {/* Additional information */}
        {result.ai_feedback && (
          <div className="bg-primary/10 p-3 rounded-md text-sm">
            <h4 className="font-medium mb-1">Analyse IA</h4>
            <p className="text-muted-foreground">{result.ai_feedback}</p>
          </div>
        )}
        
        {/* Recommendations section */}
        {Array.isArray(result.recommendations) && result.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Recommandations</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              {result.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      {showActions && (
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
          <div className="text-xs text-muted-foreground self-start">
            Analysé {formattedTime}
          </div>
          
          <div className="flex flex-wrap gap-2 self-end">
            {onShare && (
              <Button size="sm" variant="outline" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Partager
              </Button>
            )}
            
            {onDownload && (
              <Button size="sm" variant="outline" onClick={onDownload}>
                <Download className="h-4 w-4 mr-1" />
                Télécharger
              </Button>
            )}
            
            {onShowCoaching && (
              <Button size="sm" onClick={onShowCoaching}>
                Voir le coaching
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default EmotionScanResult;
