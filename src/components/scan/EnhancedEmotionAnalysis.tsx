import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EmotionResult } from '@/types/emotion';

interface EnhancedEmotionAnalysisProps {
  emotion: EmotionResult;
  recommendations?: string[];
  className?: string;
}

const EnhancedEmotionAnalysis: React.FC<EnhancedEmotionAnalysisProps> = ({
  emotion,
  recommendations = [],
  className
}) => {
  // Generate complementary insights based on emotion
  const generateInsights = (emotion: EmotionResult) => {
    const insights: Record<string, string[]> = {
      happy: [
        "Vous êtes dans un état positif, propice à la créativité",
        "Votre humeur actuelle favorise la collaboration"
      ],
      sad: [
        "Prenez un moment pour vous recentrer",
        "Considérez une courte pause méditative"
      ],
      calm: [
        "Excellent état pour les tâches nécessitant de la concentration",
        "Profitez de cette sérénité pour les décisions importantes"
      ],
      anxious: [
        "Des exercices de respiration pourraient vous aider",
        "Essayez de décomposer vos tâches en étapes plus petites"
      ],
      angry: [
        "Une courte pause pourrait vous aider à retrouver votre calme",
        "La musique apaisante peut contribuer à réduire cette tension"
      ],
      neutral: [
        "Un bon moment pour planifier votre journée",
        "Vous êtes dans un état équilibré, favorable à l'organisation"
      ]
    };
    
    const emotionKey = emotion.emotion?.toLowerCase() || 'neutral';
    return insights[emotionKey] || 
      ["Prenez conscience de votre état émotionnel", "Adaptez vos activités à votre humeur actuelle"];
  };
  
  const insights = generateInsights(emotion);
  const confidencePercent = typeof emotion.confidence === 'number' 
    ? Math.round(emotion.confidence * (emotion.confidence > 1 ? 1 : 100)) 
    : 50;
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Analyse émotionnelle détaillée</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Émotion principale : {emotion.emotion}</span>
            <span className="text-sm">{confidencePercent}%</span>
          </div>
          <Progress value={confidencePercent} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Fiabilité: {confidencePercent}%
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Insights</h4>
          <ul className="list-disc pl-5 space-y-1">
            {insights.map((insight, index) => (
              <li key={index} className="text-sm">{insight}</li>
            ))}
          </ul>
        </div>
        
        {recommendations && recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Recommandations personnalisées</h4>
            <ul className="list-disc pl-5 space-y-1">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm">{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedEmotionAnalysis;
