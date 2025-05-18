
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import TextEmotionScanner from './TextEmotionScanner';
import VoiceEmotionScanner from './VoiceEmotionScanner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmotionResult } from '@/types/emotion';

interface EmotionScanFormProps {
  userId?: string;
  onEmotionDetected?: (result: EmotionResult) => void;
  onClose?: () => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({
  userId,
  onEmotionDetected,
  onClose
}) => {
  const [scanMethod, setScanMethod] = useState<'text' | 'voice'>('text');
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  
  const handleScanResult = (result: EmotionResult) => {
    setScanResult(result);
    
    if (onEmotionDetected) {
      onEmotionDetected(result);
    }
  };
  
  const renderResult = () => {
    if (!scanResult) return null;
    
    return (
      <div className="mt-6 animate-fade-in">
        <h3 className="text-lg font-medium mb-2">Résultat de l'analyse</h3>
        <div className="p-4 rounded-lg bg-muted">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              {scanResult.emotion === 'joy' && '😊'}
              {scanResult.emotion === 'calm' && '😌'}
              {scanResult.emotion === 'anxious' && '😰'}
              {scanResult.emotion === 'sad' && '😔'}
              {!['joy', 'calm', 'anxious', 'sad'].includes(scanResult.emotion) && '😐'}
            </div>
            <div>
              <p className="font-medium">Émotion détectée: <span className="text-primary">{scanResult.emotion}</span></p>
              <p className="text-sm text-muted-foreground">Score de confiance: {Math.round((scanResult.confidence || 0) * 100)}%</p>
            </div>
          </div>
          
          {scanResult.feedback && (
            <p className="text-sm mt-3">{scanResult.feedback}</p>
          )}
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" size="sm" onClick={onClose}>Fermer</Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue={scanMethod} onValueChange={(value) => setScanMethod(value as 'text' | 'voice')}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="text">Analyse textuelle</TabsTrigger>
          <TabsTrigger value="voice">Analyse vocale</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <TextEmotionScanner onResult={handleScanResult} />
        </TabsContent>
        
        <TabsContent value="voice">
          <VoiceEmotionScanner onResult={handleScanResult} />
        </TabsContent>
      </Tabs>
      
      {scanResult && renderResult()}
    </div>
  );
};

export default EmotionScanForm;
