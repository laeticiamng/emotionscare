
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmojiEmotionScanner from './EmojiEmotionScanner';
import TextEmotionScanner from './TextEmotionScanner';
import FacialEmotionScanner from './FacialEmotionScanner';
import LiveVoiceScanner from './LiveVoiceScanner';
import { EmotionResult } from '@/types/emotion';

interface EmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel: () => void;
  initialTab?: 'emoji' | 'text' | 'facial' | 'voice';
}

const EmotionScanner: React.FC<EmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  initialTab = 'emoji'
}) => {
  const [activeTab, setActiveTab] = useState<'emoji' | 'text' | 'facial' | 'voice'>(initialTab);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleScanComplete = (result: EmotionResult) => {
    onScanComplete(result);
  };
  
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="emoji">Emoji</TabsTrigger>
        <TabsTrigger value="text">Texte</TabsTrigger>
        <TabsTrigger value="facial">Visage</TabsTrigger>
        <TabsTrigger value="voice">Voix</TabsTrigger>
      </TabsList>
      
      <TabsContent value="emoji">
        <EmojiEmotionScanner 
          onScanComplete={handleScanComplete}
          onCancel={onCancel}
          onProcessingChange={setIsProcessing}
        />
      </TabsContent>
      
      <TabsContent value="text">
        <TextEmotionScanner 
          onScanComplete={handleScanComplete}
          onCancel={onCancel}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </TabsContent>
      
      <TabsContent value="facial">
        <FacialEmotionScanner 
          onScanComplete={handleScanComplete}
          onCancel={onCancel}
        />
      </TabsContent>
      
      <TabsContent value="voice">
        <LiveVoiceScanner 
          onScanComplete={handleScanComplete}
          onCancel={onCancel}
        />
      </TabsContent>
    </Tabs>
  );
};

export default EmotionScanner;
