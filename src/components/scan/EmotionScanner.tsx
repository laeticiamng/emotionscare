
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmotionResult } from '@/types';
import { Mic, MessageSquare } from 'lucide-react';
import AudioProcessor from './AudioProcessor';
import TextEmotionScanner from './TextEmotionScanner';

interface EmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  defaultTab?: 'voice' | 'text';
}

const EmotionScanner: React.FC<EmotionScannerProps> = ({
  onResult,
  defaultTab = 'voice'
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'text'>(defaultTab);
  const [lastResult, setLastResult] = useState<EmotionResult | null>(null);

  const handleResult = (result: EmotionResult) => {
    setLastResult(result);
    if (onResult) {
      onResult(result);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analysez votre état émotionnel</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as 'voice' | 'text')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="voice" className="flex items-center">
              <Mic className="mr-2 h-4 w-4" /> Par la voix
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" /> Par le texte
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="voice" className="space-y-4">
            <AudioProcessor
              onResult={handleResult}
              headerText="Comment vous sentez-vous aujourd'hui?"
              subHeaderText="Parlez naturellement pendant quelques secondes pour une analyse émotionnelle"
            />
          </TabsContent>
          
          <TabsContent value="text" className="space-y-4">
            <TextEmotionScanner onResult={handleResult} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmotionScanner;
