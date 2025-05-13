
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { EmotionResult, UnifiedEmotionCheckinProps } from '@/types/emotion';
import TextEmotionScanner from './TextEmotionScanner';
import VoiceEmotionAnalyzer from './VoiceEmotionAnalyzer';
import FacialEmotionScanner from './FacialEmotionScanner';

const UnifiedEmotionCheckin: React.FC<UnifiedEmotionCheckinProps> = ({ onScanComplete }) => {
  const [activeTab, setActiveTab] = useState<string>('text');
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const handleEmotionDetected = useCallback((result: EmotionResult) => {
    setScanResult(result);
  }, []);
  
  const handleSubmitScan = useCallback(async () => {
    if (!scanResult) return;
    
    setIsProcessing(true);
    try {
      // In a real app, this would save the scan to a database
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show success toast
      toast({
        title: "Scan émotionnel complété",
        description: `Vous vous sentez principalement ${scanResult.dominantEmotion?.name || scanResult.emotion} avec une intensité de ${scanResult.dominantEmotion?.intensity || scanResult.intensity || 0.5}/1.`,
        variant: "success"
      });
      
      // Notify parent component if callback provided
      if (onScanComplete) {
        onScanComplete(scanResult);
      }
      
      // Reset scan result
      setScanResult(null);
    } catch (error) {
      console.error("Error processing emotion scan:", error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter le scan émotionnel. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [scanResult, onScanComplete, toast]);
  
  const renderResultSection = () => {
    if (!scanResult) return null;
    
    return (
      <Card className="mt-6 bg-muted/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Résultat de votre scan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium text-sm">Émotion principale:</div>
            <div className="text-sm capitalize">
              {scanResult.dominantEmotion?.name || scanResult.emotion || "Non détectée"}
            </div>
            
            <div className="font-medium text-sm">Intensité:</div>
            <div className="text-sm">
              {typeof (scanResult.dominantEmotion?.intensity || scanResult.intensity) === 'number' 
                ? `${Math.round((scanResult.dominantEmotion?.intensity || scanResult.intensity || 0) * 100)}%` 
                : "N/A"}
            </div>
            
            <div className="font-medium text-sm">Source:</div>
            <div className="text-sm capitalize">
              {scanResult.source || activeTab}
            </div>
          </div>
          
          <Button 
            className="w-full mt-4" 
            onClick={handleSubmitScan}
            disabled={isProcessing}
          >
            {isProcessing ? "Traitement..." : "Enregistrer ce scan"}
          </Button>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="text">Texte</TabsTrigger>
          <TabsTrigger value="voice">Voix</TabsTrigger>
          <TabsTrigger value="face">Visage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="mt-4">
          <TextEmotionScanner onEmotionDetected={handleEmotionDetected} />
        </TabsContent>
        
        <TabsContent value="voice" className="mt-4">
          <VoiceEmotionAnalyzer onEmotionDetected={handleEmotionDetected} />
        </TabsContent>
        
        <TabsContent value="face" className="mt-4">
          <FacialEmotionScanner onEmotionDetected={handleEmotionDetected} />
        </TabsContent>
      </Tabs>
      
      {renderResultSection()}
    </div>
  );
};

export default UnifiedEmotionCheckin;
