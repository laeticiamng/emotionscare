
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { EmotionResult, EmotionScanFormProps } from '@/types/emotion';
import VoiceEmotionScanner from './VoiceEmotionScanner';
import TextEmotionScanner from './TextEmotionScanner';
import EmojiEmotionScanner from './EmojiEmotionScanner';

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({
  onScanComplete,
  userId,
  onEmotionDetected,
  onClose,
  defaultTab = 'voice',
  onProcessingChange,
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleProcessingChange = (processing: boolean) => {
    setIsProcessing(processing);
    if (onProcessingChange) {
      onProcessingChange(processing);
    }
  };

  const handleScanResult = (result: EmotionResult) => {
    handleProcessingChange(false);
    if (onScanComplete) {
      onScanComplete(result);
    }
    
    // Call onEmotionDetected if provided
    if (onEmotionDetected) {
      onEmotionDetected(result);
    }
    
    // Call onClose if provided
    if (onClose) {
      onClose();
    }
  };

  return (
    <Card className="w-full">
      <Tabs
        defaultValue={defaultTab}
        value={activeTab}
        onValueChange={(value) => {
          if (!isProcessing) {
            setActiveTab(value);
          }
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="voice" disabled={isProcessing}>
            Par la voix
          </TabsTrigger>
          <TabsTrigger value="text" disabled={isProcessing}>
            Par le texte
          </TabsTrigger>
          <TabsTrigger value="emoji" disabled={isProcessing}>
            Par emoji
          </TabsTrigger>
          {/*<TabsTrigger value="facial" disabled={isProcessing}>
            Visage
          </TabsTrigger>*/}
        </TabsList>

        <div className="p-4">
          <TabsContent value="voice" className="space-y-4 mt-0">
            <VoiceEmotionScanner 
              onResult={handleScanResult} 
              onProcessingChange={handleProcessingChange}
            />
          </TabsContent>

          <TabsContent value="text" className="space-y-4 mt-0">
            <TextEmotionScanner 
              onResult={handleScanResult}
              onProcessingChange={handleProcessingChange} 
            />
          </TabsContent>

          <TabsContent value="emoji" className="space-y-4 mt-0">
            <EmojiEmotionScanner 
              onResult={handleScanResult}
              onProcessingChange={handleProcessingChange} 
            />
          </TabsContent>

          <TabsContent value="facial" className="space-y-4 mt-0">
            {/* This has been commented out but we keep it for compatibility
            <FacialEmotionScanner onResult={handleScanResult} /> */}
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default EmotionScanForm;
