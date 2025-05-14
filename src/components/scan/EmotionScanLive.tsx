
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmotionResult } from '@/types/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmotionScanLiveProps {
  result: EmotionResult | null;
  loading?: boolean;
  onRetry?: () => void;
}

const EmotionScanLive: React.FC<EmotionScanLiveProps> = ({
  result,
  loading = false,
  onRetry
}) => {
  const [timeAgo, setTimeAgo] = useState<string>('');
  
  useEffect(() => {
    if (result?.date) {
      try {
        // Handle date regardless of format (string or Date)
        const date = new Date(result.date);
        const formattedTimeAgo = formatDistanceToNow(date, { addSuffix: true, locale: fr });
        setTimeAgo(formattedTimeAgo);
      } catch (error) {
        console.error('Error formatting date:', error);
        setTimeAgo('récemment');
      }
    }
  }, [result]);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyse en cours...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aucun résultat</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Aucune analyse émotionnelle récente n'a été trouvée.</p>
          {onRetry && (
            <Button onClick={onRetry}>Effectuer une analyse</Button>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Votre état émotionnel actuel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold capitalize">{result.emotion}</h3>
              <p className="text-sm text-muted-foreground">
                {timeAgo ? `Détecté ${timeAgo}` : 'Détecté récemment'}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 text-primary text-3xl">
              {result.emojis && result.emojis[0] ? result.emojis[0] : '😊'}
            </div>
          </div>
          
          {result.score !== undefined && (
            <div>
              <p className="text-sm font-medium mb-1">Intensité</p>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${Math.round(result.score * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Faible</span>
                <span className="text-xs text-muted-foreground">Élevée</span>
              </div>
            </div>
          )}
          
          {result.ai_feedback && (
            <div className="p-3 bg-muted/30 rounded-md">
              <p className="text-sm">{result.ai_feedback}</p>
            </div>
          )}
          
          {onRetry && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={onRetry} size="sm">
                Refaire l'analyse
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionScanLive;
