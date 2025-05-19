
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TextEmotionScanner from './TextEmotionScanner';
import VoiceEmotionScanner from './VoiceEmotionScanner';
import EmojiEmotionScanner from './EmojiEmotionScanner';
import { EmotionResult } from '@/types/emotion';
import AudioProcessor from './AudioProcessor';

interface EmotionScannerProps {
  onAnalysisComplete?: (result: EmotionResult) => void;
  defaultTab?: 'text' | 'voice' | 'emoji';
  showHistory?: boolean;
  className?: string;
}

const EmotionScanner: React.FC<EmotionScannerProps> = ({
  onAnalysisComplete,
  defaultTab = 'voice',
  showHistory = false,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const handleTextResult = (result: EmotionResult) => {
    if (onAnalysisComplete) {
      onAnalysisComplete({
        ...result,
        source: 'text',
      });
    }
  };

  const handleVoiceResult = (result: EmotionResult) => {
    if (onAnalysisComplete) {
      onAnalysisComplete({
        ...result,
        source: 'voice',
      });
    }
  };

  const handleEmojiResult = (result: EmotionResult) => {
    if (onAnalysisComplete) {
      onAnalysisComplete({
        ...result,
        source: 'emoji',
      });
    }
  };

  const handleAudioResult = (analysisResult: EmotionResult) => {
    if (onAnalysisComplete) {
      onAnalysisComplete({
        ...analysisResult,
        source: 'voice',
      });
    }
  };

  // Stop recording when changing tabs
  useEffect(() => {
    setIsRecording(false);
  }, [activeTab]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Scanner votre émotion actuelle</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="voice" disabled={isProcessing}>
              Voix
            </TabsTrigger>
            <TabsTrigger value="text" disabled={isProcessing}>
              Texte
            </TabsTrigger>
            <TabsTrigger value="emoji" disabled={isProcessing}>
              Emoji
            </TabsTrigger>
          </TabsList>
          <TabsContent value="voice" className="space-y-4">
            <AudioProcessor
              onResult={handleAudioResult}
              onProcessingChange={setIsProcessing}
              isRecording={isRecording}
              setIsProcessing={setIsProcessing}
            />
          </TabsContent>
          <TabsContent value="text" className="space-y-4">
            <TextEmotionScanner
              onResult={handleTextResult}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </TabsContent>
          <TabsContent value="emoji" className="space-y-4">
            <EmojiEmotionScanner
              onResult={handleEmojiResult}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmotionScanner;
