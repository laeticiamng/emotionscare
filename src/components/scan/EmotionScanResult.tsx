
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MusicRecommendation from './MusicRecommendation';
import VREmotionRecommendation from '../vr/VREmotionRecommendation';
import type { Emotion, EmotionResult } from '@/types';

interface EmotionScanResultProps {
  data: EmotionResult;
}

const EmotionScanResult: React.FC<EmotionScanResultProps> = ({ data }) => {
  // Derive an emotion label from available properties
  const emotionLabel = getEmotionLabel(data);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Votre résultat émotionnel: {emotionLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations" className="space-y-4">
            <p className="text-muted-foreground mb-4">
              Basé sur votre état émotionnel actuel, voici quelques recommandations pour votre bien-être:
            </p>
            
            <div className="space-y-6">
              <MusicRecommendation emotion={data} />
              <VREmotionRecommendation emotion={data} />
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Émotion détectée</h3>
                <p className="text-2xl font-bold">{emotionLabel}</p>
              </div>
              
              {data.emojis && (
                <div>
                  <h3 className="font-medium mb-1">Émojis</h3>
                  <p className="text-2xl">{data.emojis}</p>
                </div>
              )}
              
              {data.score !== undefined && (
                <div>
                  <h3 className="font-medium mb-1">Intensité</h3>
                  <p className="text-2xl font-bold">{data.score}/10</p>
                </div>
              )}
              
              {(data.ai_feedback || data.feedback) && (
                <div>
                  <h3 className="font-medium mb-1">Analyse IA</h3>
                  <p className="text-muted-foreground">{data.ai_feedback || data.feedback}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper function to derive an emotion label
function getEmotionLabel(emotion: EmotionResult | Emotion): string {
  // If it's an EmotionResult with a direct emotion property
  if ('emotion' in emotion && emotion.emotion) {
    return emotion.emotion;
  }
  
  // If it has emojis, try to derive emotion
  if ('emojis' in emotion && emotion.emojis) {
    if (emotion.emojis.includes('😊') || emotion.emojis.includes('😄')) return 'Heureux';
    if (emotion.emojis.includes('😢') || emotion.emojis.includes('😭')) return 'Triste';
    if (emotion.emojis.includes('😡') || emotion.emojis.includes('😠')) return 'En colère';
    if (emotion.emojis.includes('😰') || emotion.emojis.includes('😨')) return 'Anxieux';
    if (emotion.emojis.includes('😌') || emotion.emojis.includes('🧘')) return 'Calme';
  }
  
  // Try to derive from text
  if ('text' in emotion && emotion.text) {
    const text = emotion.text.toLowerCase();
    if (text.includes('heureux') || text.includes('joie')) return 'Heureux';
    if (text.includes('triste') || text.includes('peine')) return 'Triste';
    if (text.includes('colère') || text.includes('frustré')) return 'En colère';
    if (text.includes('anxieux') || text.includes('stress')) return 'Anxieux';
    if (text.includes('calme') || text.includes('apaisé')) return 'Calme';
  }
  
  // Fallback to score-based label
  if ('score' in emotion && emotion.score !== undefined) {
    if (emotion.score > 80) return 'Très positif';
    if (emotion.score > 60) return 'Positif';
    if (emotion.score > 40) return 'Neutre';
    if (emotion.score > 20) return 'Négatif';
    return 'Très négatif';
  }
  
  return 'État émotionnel';
}

export default EmotionScanResult;
