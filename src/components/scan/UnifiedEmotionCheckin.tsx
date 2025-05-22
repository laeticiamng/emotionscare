import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { getEmotionByName, EmotionResult } from '@/types/emotion';

interface UnifiedEmotionCheckinProps {
  className?: string;
}

const UnifiedEmotionCheckin: React.FC<UnifiedEmotionCheckinProps> = ({ className = '' }) => {
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([
    {
      primaryEmotion: 'calm',
      secondaryEmotion: 'content',
      intensity: 4,
      source: 'emoji',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      primaryEmotion: 'anxious',
      secondaryEmotion: 'frustrated',
      intensity: 3,
      source: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
    },
    {
      primaryEmotion: 'happy',
      intensity: 5,
      source: 'facial',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
    }
  ]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if it's yesterday
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Hier, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise return full date
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getEmotionText = (result: EmotionResult) => {
    const primary = getEmotionByName(result.primaryEmotion);
    const secondary = result.secondaryEmotion ? getEmotionByName(result.secondaryEmotion) : null;
    
    if (secondary) {
      return `${primary.label} et ${secondary.label.toLowerCase()}`;
    }
    
    return primary.label;
  };
  
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'emoji':
        return '😊';
      case 'text':
        return '📝';
      case 'facial':
        return '📷';
      case 'voice':
        return '🎤';
      default:
        return '📊';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle>Historique émotionnel</CardTitle>
      </CardHeader>
      <CardContent>
        {emotionHistory.length > 0 ? (
          <div className="space-y-4">
            {emotionHistory.map((result, index) => {
              const primary = getEmotionByName(result.primaryEmotion);
              
              return (
                <div 
                  key={index}
                  className="flex items-center p-3 rounded-lg bg-accent/50"
                >
                  <div className="mr-3 text-2xl">
                    {primary.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {getEmotionText(result)}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <span>{formatDate(result.timestamp)}</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        {getSourceIcon(result.source)}
                        <span className="ml-1 text-xs">
                          {result.source === 'emoji' ? 'Emojis' :
                           result.source === 'text' ? 'Texte' : 
                           result.source === 'facial' ? 'Visage' : 
                           result.source === 'voice' ? 'Voix' : 'Manuel'}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center rounded-full w-8 h-8 bg-background">
                    <span className="text-sm font-medium">{result.intensity}/5</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Aucun historique disponible</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedEmotionCheckin;
