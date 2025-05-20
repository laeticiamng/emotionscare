
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types';
import TextEmotionScanner from './TextEmotionScanner';
import EmojiEmotionScanner from './EmojiEmotionScanner';
import VoiceEmotionScanner from './VoiceEmotionScanner';
import FacialEmotionScanner from './FacialEmotionScanner';

export interface EmotionScanFormProps {
  onComplete: (result: EmotionResult) => void;
  onEmotionDetected?: (result: EmotionResult) => void;
  onClose?: () => void;
  onScanSaved?: () => void;
  userId?: string;
  defaultTab?: string;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({
  onComplete,
  onEmotionDetected,
  onClose,
  onScanSaved,
  userId,
  defaultTab = 'text'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScanComplete = (result: EmotionResult) => {
    // Add user ID to the result if provided
    const completeResult = userId ? { ...result, userId } : result;
    
    // Notify parent component
    onComplete(completeResult);
    
    // Indicate that scan is saved
    if (onScanSaved) onScanSaved();
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm animate-in fade-in-0 slide-in-from-bottom-5">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Scanner votre émotion</h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Fermer
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Choisissez une méthode pour analyser votre état émotionnel actuel
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="p-4"
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="text">Texte</TabsTrigger>
          <TabsTrigger value="emoji">Emoji</TabsTrigger>
          <TabsTrigger value="voice">Voix</TabsTrigger>
          <TabsTrigger value="facial">Visage</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <TextEmotionScanner 
            onScanComplete={handleScanComplete}
            isProcessing={isProcessing} 
            setIsProcessing={setIsProcessing}
          />
        </TabsContent>

        <TabsContent value="emoji" className="space-y-4">
          <EmojiEmotionScanner 
            onScanComplete={handleScanComplete}
            isProcessing={isProcessing} 
            setIsProcessing={setIsProcessing}
          />
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <VoiceEmotionScanner 
            onEmotionDetected={handleScanComplete}
          />
        </TabsContent>

        <TabsContent value="facial" className="space-y-4">
          <FacialEmotionScanner 
            onScanComplete={handleScanComplete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmotionScanForm;
