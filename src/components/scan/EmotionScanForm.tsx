
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextEmotionScanner from './TextEmotionScanner';
import AudioEmotionScanner from './AudioEmotionScanner';
import EmojiEmotionScanner from './EmojiEmotionScanner';
import { EmotionResult } from '@/types/emotion';
import { X, FileText, Mic, Smile } from 'lucide-react';

interface EmotionScanFormProps {
  onComplete: (result: EmotionResult) => void;
  onClose: () => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ onComplete, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Scanner vos émotions</CardTitle>
            <CardDescription>
              Choisissez la méthode d'analyse qui vous convient le mieux
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Texte
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="emoji" className="flex items-center gap-2">
              <Smile className="h-4 w-4" />
              Émojis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text">
            <TextEmotionScanner
              onScanComplete={onComplete}
              onCancel={onClose}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </TabsContent>
          
          <TabsContent value="audio">
            <AudioEmotionScanner
              onScanComplete={onComplete}
              onCancel={onClose}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </TabsContent>
          
          <TabsContent value="emoji">
            <EmojiEmotionScanner
              onScanComplete={onComplete}
              onCancel={onClose}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmotionScanForm;
