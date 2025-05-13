import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmotionResult } from '@/types/emotion';
import FacialEmotionScanner from './FacialEmotionScanner';
import TextEmotionScanner from './TextEmotionScanner';
import EmotionSelector from '@/components/emotions/EmotionSelector';
import { emotionColors, primaryEmotions } from '@/data/emotions';
import EmojiEmotionScanner from './EmojiEmotionScanner';
import VoiceEmotionAnalyzer from './VoiceEmotionAnalyzer';
import { cn } from '@/lib/utils';

interface UnifiedEmotionCheckinProps {
  onEmotionDetected: (result: EmotionResult) => void;
  onClose?: () => void;
}

const UnifiedEmotionCheckin: React.FC<UnifiedEmotionCheckinProps> = ({ onEmotionDetected, onClose }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('emoji');

  const handleEmotionResult = (result: EmotionResult) => {
    // Convert intensity to score if needed
    const finalResult: EmotionResult = {
      ...result,
      // Ensure we have a score even if only intensity was provided
      score: result.score || result.intensity || 0.5
    };
    
    setSelectedEmotion(finalResult);
    onEmotionDetected(finalResult);
    onClose?.();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Comment vous sentez-vous ?</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="emoji" className="space-y-4">
          <TabsList>
            <TabsTrigger value="emoji">Emoji</TabsTrigger>
            <TabsTrigger value="text">Texte</TabsTrigger>
            <TabsTrigger value="voice">Voix</TabsTrigger>
            <TabsTrigger value="face">Visage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="emoji">
            <EmojiTab onEmotionDetected={handleEmotionResult} />
          </TabsContent>
          
          <TabsContent value="text">
            <TextTab onEmotionDetected={handleEmotionResult} />
          </TabsContent>
          
          <TabsContent value="voice">
            <VoiceTab onEmotionDetected={handleEmotionResult} />
          </TabsContent>
          
          <TabsContent value="face">
            <FacialTab onEmotionDetected={handleEmotionResult} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const TextTab: React.FC<{
  onEmotionDetected: (result: EmotionResult) => void;
}> = ({ onEmotionDetected }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Décrivez vos émotions en quelques mots pour obtenir une analyse.
      </p>
      
      <TextEmotionScanner onEmotionDetected={onEmotionDetected} />
    </div>
  );
};

const VoiceTab: React.FC<{
  onEmotionDetected: (result: EmotionResult) => void;
}> = ({ onEmotionDetected }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enregistrez votre voix pour une analyse émotionnelle basée sur votre ton et votre discours.
      </p>
      
      <VoiceEmotionAnalyzer onEmotionDetected={onEmotionDetected} />
    </div>
  );
};

const EmojiTab: React.FC<{
  onEmotionDetected: (result: EmotionResult) => void;
}> = ({ onEmotionDetected }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(0.5);

  const handleSelectEmotion = (emotion: string, value: number) => {
    setSelectedEmotion(emotion);
    setIntensity(value);
  };

  const handleSubmit = () => {
    if (selectedEmotion) {
      onEmotionDetected({
        emotion: selectedEmotion,
        score: intensity,
        intensity: intensity
      });
    }
  };

  return (
    <div className="space-y-4">
      <EmotionSelector 
        selectedEmotion={selectedEmotion} 
        onSelectEmotion={setSelectedEmotion}
        emotions={primaryEmotions}
        onSelect={handleSelectEmotion}
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedEmotion}
        >
          Enregistrer cette émotion
        </Button>
      </div>
    </div>
  );
};

const FacialTab: React.FC<{
  onEmotionDetected: (result: EmotionResult) => void;
}> = ({ onEmotionDetected }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Votre caméra analysera vos expressions faciales pour déterminer votre état émotionnel.
        Nous respectons votre vie privée - les images ne sont pas stockées.
      </p>
      
      <FacialEmotionScanner onEmotionDetected={onEmotionDetected} />
    </div>
  );
};

export default UnifiedEmotionCheckin;
