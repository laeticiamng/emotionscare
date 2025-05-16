
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MusicRecommendation from './MusicRecommendation';
import EmotionFeedback from './EmotionFeedback';

interface EmotionScanResultProps {
  result: EmotionResult;
  onSaveFeedback?: (feedback: string) => void;
  onReset?: () => void;
  showMusic?: boolean;
}

const EmotionScanResult: React.FC<EmotionScanResultProps> = ({
  result,
  onSaveFeedback,
  onReset,
  showMusic = true
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  const getEmotionDescription = (emotion: string) => {
    const descriptions: Record<string, string> = {
      happy: "Vous êtes dans un état de bonheur et de contentement. C'est un excellent moment pour être créatif et socialiser.",
      sad: "Vous ressentez de la tristesse. Prenez soin de vous et n'hésitez pas à chercher du soutien si nécessaire.",
      angry: "Vous ressentez de la colère ou de la frustration. Des techniques de respiration pourraient vous aider à vous calmer.",
      anxious: "Vous êtes dans un état d'anxiété. Essayez de prendre quelques respirations profondes et de recentrer vos pensées.",
      calm: "Vous êtes dans un état de calme et de sérénité. C'est un excellent moment pour la méditation ou la réflexion.",
      tired: "Vous vous sentez fatigué. Envisagez de vous reposer ou de faire une courte pause.",
      neutral: "Vous êtes dans un état émotionnel neutre et équilibré.",
      mixed: "Vous avez des émotions mixtes. C'est normal et cela reflète la complexité de l'expérience humaine."
    };
    
    return descriptions[emotion.toLowerCase()] || 
      "Cette émotion reflète votre état actuel. Prenez conscience de ce que vous ressentez.";
  };
  
  const getRecommendations = (emotion: string) => {
    const recommendations: Record<string, string[]> = {
      happy: [
        "Partagez votre bonne humeur avec les autres",
        "Engagez-vous dans des activités créatives",
        "Profitez de cet état pour aborder des tâches difficiles"
      ],
      sad: [
        "Accordez-vous un moment de pause",
        "Contactez un ami proche ou un membre de votre famille",
        "Écoutez de la musique apaisante"
      ],
      angry: [
        "Prenez quelques respirations profondes",
        "Faites une courte promenade si possible",
        "Écrivez ce qui vous préoccupe dans votre journal"
      ],
      anxious: [
        "Essayez un exercice de respiration guidée",
        "Décomposez vos tâches en petites étapes gérables",
        "Limitez votre consommation de caféine"
      ],
      calm: [
        "C'est un bon moment pour la méditation",
        "Profitez de cet état pour prendre des décisions importantes",
        "Pratiquez la pleine conscience"
      ]
    };
    
    return recommendations[emotion.toLowerCase()] || [
      "Prenez conscience de vos émotions",
      "Accordez-vous un moment de réflexion",
      "Adaptez vos activités à votre humeur actuelle"
    ];
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Résultat de l'analyse</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="summary">Résumé</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            {showMusic && <TabsTrigger value="music">Musique</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium">{result.emotion}</p>
                  <p className="text-sm text-muted-foreground">
                    Intensité: {result.score}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Confiance</p>
                  <p className="text-sm">{Math.round(result.confidence * 100)}%</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Ce que cela signifie</h3>
              <p className="text-sm">{getEmotionDescription(result.emotion)}</p>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Recommandations</h3>
              <ul className="space-y-1 pl-5 list-disc">
                {getRecommendations(result.emotion).map((recommendation, index) => (
                  <li key={index} className="text-sm">{recommendation}</li>
                ))}
              </ul>
            </div>
            
            {result.feedback ? (
              <div className="p-4 bg-muted rounded-md">
                <h3 className="text-sm font-medium mb-1">Votre ressenti</h3>
                <p className="text-sm italic">{result.feedback}</p>
              </div>
            ) : (
              onSaveFeedback && (
                <div>
                  <h3 className="text-md font-medium mb-2">Comment vous sentez-vous réellement ?</h3>
                  <EmotionFeedback result={result} onSaveFeedback={onSaveFeedback} />
                </div>
              )
            )}
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2">Données techniques</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Émotion:</div>
                  <div>{result.emotion}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Score:</div>
                  <div>{result.score}%</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Confiance:</div>
                  <div>{Math.round(result.confidence * 100)}%</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Date:</div>
                  <div>{new Date(result.date).toLocaleString()}</div>
                </div>
                {result.text && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Texte analysé:</div>
                    <div>{result.text}</div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {showMusic && (
            <TabsContent value="music">
              <MusicRecommendation emotion={result.emotion} intensity={result.score / 100} />
            </TabsContent>
          )}
        </Tabs>
        
        {onReset && (
          <div className="mt-6">
            <Button onClick={onReset} variant="outline" className="w-full">
              Nouvelle analyse
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionScanResult;
