
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import TextEmotionScanner from './TextEmotionScanner';
import VoiceEmotionAnalyzer from './VoiceEmotionAnalyzer';
import FacialEmotionScanner from './FacialEmotionScanner';
import { EmotionResult } from '@/types/emotion';

interface UnifiedEmotionCheckinProps {
  onScanComplete?: (result: EmotionResult) => void;
}

const UnifiedEmotionCheckin: React.FC<UnifiedEmotionCheckinProps> = ({ onScanComplete }) => {
  const [activeTab, setActiveTab] = useState<string>('text');
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleEmotionDetected = (result: EmotionResult) => {
    setScanResult(result);
  };

  const handleSave = async () => {
    if (!scanResult) return;
    
    setIsSaving(true);
    try {
      // In a real implementation, this would save to a database
      
      // Show success message
      toast({
        title: "Émotion enregistrée",
        description: `${scanResult.dominantEmotion?.name || 'Émotion'} détectée avec une intensité de ${scanResult.dominantEmotion?.intensity || 0}.`,
        variant: "default" // Changed from "success" to "default"
      });
      
      // Pass result to parent
      if (onScanComplete) {
        onScanComplete(scanResult);
      }
      
    } catch (error) {
      console.error('Error saving scan:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'émotion.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="text">Texte</TabsTrigger>
          <TabsTrigger value="voice">Voix</TabsTrigger>
          <TabsTrigger value="face">Visage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <TextEmotionScanner onEmotionDetected={handleEmotionDetected} />
        </TabsContent>
        
        <TabsContent value="voice">
          <VoiceEmotionAnalyzer onEmotionDetected={handleEmotionDetected} />
        </TabsContent>
        
        <TabsContent value="face">
          <FacialEmotionScanner onEmotionDetected={handleEmotionDetected} />
        </TabsContent>
      </Tabs>
      
      {scanResult && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Résultat de l'analyse</h3>
          <div className="mt-2 p-4 bg-muted rounded-md">
            <p className="mb-2">
              <span className="font-semibold">Émotion détectée:</span> {scanResult.dominantEmotion?.name || 'Non détectée'}
            </p>
            <p>
              <span className="font-semibold">Intensité:</span> {scanResult.dominantEmotion?.intensity || 0}/1
            </p>
            
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Enregistrement...' : 'Enregistrer cette émotion'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default UnifiedEmotionCheckin;
