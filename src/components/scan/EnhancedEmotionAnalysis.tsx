import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown } from 'lucide-react';

interface EnhancedEmotionAnalysisProps {
  emotion?: string | { emotion: string; score: number };
  onAction?: (action: string) => void;
  showHistory?: boolean;
}

const EnhancedEmotionAnalysis = ({ emotion, onAction, showHistory }: EnhancedEmotionAnalysisProps) => {
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'joy': return <Smile className="h-4 w-4 mr-2 text-yellow-500" />;
      case 'sadness': return <Frown className="h-4 w-4 mr-2 text-blue-500" />;
      case 'neutral': return <Meh className="h-4 w-4 mr-2 text-gray-500" />;
      default: return null;
    }
  };

  const renderEmotionCard = () => {
    if (!emotion) return null;
    
    // Handle both string and object emotion types
    const emotionName = typeof emotion === 'string' ? emotion : emotion.emotion;
    const emotionLabel = emotionName.charAt(0).toUpperCase() + emotionName.slice(1);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {getEmotionIcon(emotionName)}
            {emotionLabel}
          </CardTitle>
          <CardDescription>Analyse émotionnelle</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">Emotion détectée</Badge>
          <p className="mt-2 text-sm text-muted-foreground">
            Nous avons détecté que vous ressentez principalement de l'émotion {emotionName}.
          </p>
          <div className="mt-4 space-x-2">
            <Button size="sm" onClick={() => onAction && onAction('meditation')}>
              Lancer une méditation
            </Button>
            <Button size="sm" variant="outline" onClick={() => onAction && onAction('journal')}>
              Ecrire dans mon journal
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      {renderEmotionCard()}
    </div>
  );
};

export default EnhancedEmotionAnalysis;
