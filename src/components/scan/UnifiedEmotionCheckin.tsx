import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MicIcon, TextIcon, Camera, Music } from 'lucide-react';
import LiveVoiceScanner from './live/LiveVoiceScanner';
import { EmotionResult } from '@/types/emotion';

const UnifiedEmotionCheckin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('voice');
  const [emotionDetected, setEmotionDetected] = useState<EmotionResult | null>(null);
  
  const handleEmotionDetected = (emotion: string, result: EmotionResult) => {
    setEmotionDetected(result);
    // Here you could also trigger other actions like updating user's emotional state
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle>Comment vous sentez-vous aujourd'hui ?</CardTitle>
        <CardDescription>
          Choisissez une méthode pour analyser votre état émotionnel
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full rounded-none border-b">
            <TabsTrigger value="voice" className="data-[state=active]:bg-muted/50">
              <MicIcon className="h-4 w-4 mr-2" />
              Voix
            </TabsTrigger>
            <TabsTrigger value="text" className="data-[state=active]:bg-muted/50">
              <TextIcon className="h-4 w-4 mr-2" />
              Texte
            </TabsTrigger>
            <TabsTrigger value="camera" className="data-[state=active]:bg-muted/50" disabled>
              <Camera className="h-4 w-4 mr-2" />
              Caméra
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="voice" className="p-0">
            <LiveVoiceScanner 
              onResult={(result) => {
                if (result.emotion) {
                  handleEmotionDetected(result.emotion, result);
                }
              }} 
            />
          </TabsContent>
          
          <TabsContent value="text" className="p-6 min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Décrivez comment vous vous sentez pour une analyse émotionnelle
              </p>
              <Button disabled>
                Fonctionnalité à venir
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="camera" className="p-6 min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Analyse émotionnelle par reconnaissance faciale
              </p>
              <Button disabled>
                Fonctionnalité à venir
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {emotionDetected && (
          <div className="p-4 border-t">
            <div className="text-sm font-medium mb-1">Dernière détection</div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold capitalize">
                {emotionDetected.emotion}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setEmotionDetected(null)}>
                Effacer
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedEmotionCheckin;
