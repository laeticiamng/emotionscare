
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MusicRecommendation from './MusicRecommendation';
import VREmotionRecommendation from '../vr/VREmotionRecommendation';
import type { Emotion } from '@/types';

interface EmotionScanResultProps {
  emotion: Emotion;
}

const EmotionScanResult: React.FC<EmotionScanResultProps> = ({ emotion }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Votre résultat émotionnel: {emotion.emotion}</CardTitle>
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
              <MusicRecommendation emotion={emotion} />
              <VREmotionRecommendation emotion={emotion} />
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Émotion détectée</h3>
                <p className="text-2xl font-bold">{emotion.emotion}</p>
              </div>
              
              {emotion.score && (
                <div>
                  <h3 className="font-medium mb-1">Intensité</h3>
                  <p className="text-2xl font-bold">{emotion.score}/10</p>
                </div>
              )}
              
              {emotion.ai_feedback && (
                <div>
                  <h3 className="font-medium mb-1">Analyse IA</h3>
                  <p className="text-muted-foreground">{emotion.ai_feedback}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmotionScanResult;
