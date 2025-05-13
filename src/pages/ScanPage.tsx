
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UnifiedEmotionCheckin from '@/components/scan/UnifiedEmotionCheckin';
import { EmotionResult } from '@/types/emotion';
import EmotionBasedMusicRecommendation from '@/components/music/EmotionBasedMusicRecommendation';

const ScanPage: React.FC = () => {
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  
  const handleScanComplete = (result: EmotionResult) => {
    setEmotionResult(result);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Analyse émotionnelle</h1>
      <p className="text-muted-foreground">
        Découvrez et suivez votre état émotionnel grâce à plusieurs méthodes d'analyse
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UnifiedEmotionCheckin onScanComplete={handleScanComplete} />
        
        <div className="space-y-6">
          {emotionResult && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Résultat de l'analyse</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Émotion principale</h3>
                      <p className="text-2xl font-semibold">
                        {emotionResult.dominantEmotion?.name || 'Non détectée'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Intensité</h3>
                      <p className="text-xl">
                        {emotionResult.dominantEmotion?.intensity ? 
                          `${(emotionResult.dominantEmotion.intensity * 10).toFixed(1)}/10` : 
                          'N/A'}
                      </p>
                    </div>
                    
                    {emotionResult.ai_feedback && (
                      <div>
                        <h3 className="font-medium">Analyse IA</h3>
                        <p className="text-muted-foreground">{emotionResult.ai_feedback}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {emotionResult && (
                <EmotionBasedMusicRecommendation 
                  emotionResult={emotionResult}
                  variant="standalone"
                />
              )}
            </>
          )}
          
          {!emotionResult && (
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Utilisez l'un des modes d'analyse pour détecter votre état émotionnel :
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Analyse faciale par webcam (la plus précise)</li>
                  <li>Description textuelle de votre ressenti</li>
                  <li>Sélection d'émojis représentant votre humeur</li>
                  <li>Enregistrement vocal exprimant vos émotions</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
