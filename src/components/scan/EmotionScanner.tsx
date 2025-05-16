
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmotionResult } from '@/types/emotion';
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
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  
  const handleVoiceResult = (analysisResult: EmotionResult) => {
    setResult(analysisResult);
    
    if (onResult) {
      onResult(analysisResult);
    }
  };
  
  const handleTextResult = (analysisResult: EmotionResult) => {
    setResult(analysisResult);
    
    if (onResult) {
      onResult(analysisResult);
    }
  };
  
  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scanner Émotionnel</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          defaultValue={defaultTab} 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voix
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Texte
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="voice" className="space-y-4">
            <div className="text-center py-4">
              <Button 
                onClick={handleRecordToggle}
                variant={isRecording ? "destructive" : "default"}
                className="h-16 w-16 rounded-full flex items-center justify-center"
                disabled={isProcessing}
              >
                <Mic className="h-6 w-6" />
              </Button>
              
              <p className="mt-2 text-sm">
                {isRecording ? "Cliquez pour arrêter l'enregistrement" : "Cliquez pour commencer"}
              </p>
            </div>
            
            <AudioProcessor 
              isRecording={isRecording} 
              onResult={handleVoiceResult}
              onProcessingChange={setIsProcessing}
            />
          </TabsContent>
          
          <TabsContent value="text">
            <TextEmotionScanner onResult={handleTextResult} />
          </TabsContent>
        </Tabs>
        
        {result && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <h3 className="font-semibold text-lg">Résultat</h3>
            <div className="mt-2 space-y-1">
              <p>Émotion détectée: <span className="font-medium">{result.emotion}</span></p>
              <p>Score: <span className="font-medium">{result.score}%</span></p>
              <p>Confiance: <span className="font-medium">{Math.round(result.confidence * 100)}%</span></p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionScanner;
