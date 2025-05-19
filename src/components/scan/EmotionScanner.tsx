
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

interface AudioEmotionScannerProps {
  onComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  autoStart?: boolean;
}

const AudioEmotionScanner: React.FC<AudioEmotionScannerProps> = ({ 
  onComplete, 
  onCancel,
  autoStart = false
}) => {
  return (
    <LiveVoiceScanner 
      onScanComplete={onComplete} 
      onCancel={onCancel}
      autoStart={autoStart}
    />
  );
};

const EmotionScanner: React.FC<EmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  initialTab = 'emoji'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isScanning, setIsScanning] = useState(false);
  
  const handleScanComplete = (result: EmotionResult) => {
    onScanComplete(result);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="emoji">Emoji</TabsTrigger>
          <TabsTrigger value="text">Texte</TabsTrigger>
          <TabsTrigger value="facial">Visage</TabsTrigger>
          <TabsTrigger value="voice">Voix</TabsTrigger>
        </TabsList>
        
        <TabsContent value="emoji">
          <EmojiEmotionScanner
            onScanComplete={handleScanComplete}
            onCancel={onCancel}
            onProcessingChange={setIsScanning}
          />
        </TabsContent>
        
        <TabsContent value="text">
          <TextEmotionScanner
            onScanComplete={handleScanComplete}
            onCancel={onCancel}
            isProcessing={isScanning}
            setIsProcessing={setIsScanning}
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
    </div>
  );
};

export default EmotionScanner;
