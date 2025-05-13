import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { EmotionResult } from '@/types/emotion';
import { useToast } from '@/components/ui/use-toast';
import { Mic, Camera, FileText, Loader2 } from 'lucide-react';
import EmotionSelector from '@/components/emotions/EmotionSelector';
import { emotionColors, primaryEmotions } from '@/data/emotions';
import FacialEmotionScanner from './FacialEmotionScanner';
import VoiceEmotionAnalyzer from './VoiceEmotionAnalyzer';
import { cn } from '@/lib/utils';

interface EmotionCheckinProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  onScanComplete?: () => void;
  className?: string;
  compact?: boolean;
  defaultTab?: string;
  showHeader?: boolean;
  showTabs?: boolean;
}

const UnifiedEmotionCheckin: React.FC<EmotionCheckinProps> = ({
  onEmotionDetected,
  onScanComplete,
  className,
  compact = false,
  defaultTab = 'text',
  showHeader = true,
  showTabs = true,
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(50);
  const [text, setText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);
  const { toast } = useToast();

  // Reset form when tab changes
  useEffect(() => {
    setSelectedEmotion('');
    setIntensity(50);
    setText('');
    setScanResult(null);
  }, [activeTab]);

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmotion) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner une émotion",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result: EmotionResult = {
        emotion: selectedEmotion,
        intensity: intensity,
        text: text,
        confidence: 0.9,
        date: new Date().toISOString(),
        primaryEmotion: {
          name: selectedEmotion,
          intensity: intensity / 100
        }
      };
      
      setScanResult(result);
      
      if (onEmotionDetected) {
        onEmotionDetected(result);
      }
      
      toast({
        title: "Émotion enregistrée",
        description: `Vous vous sentez ${selectedEmotion.toLowerCase()} avec une intensité de ${intensity}%`,
      });
      
      if (onScanComplete) {
        onScanComplete();
      }
    } catch (error) {
      console.error('Error processing emotion:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre émotion",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmotionDetected = (emotionResult: EmotionResult) => {
    setScanResult(emotionResult);
    
    if (onEmotionDetected) {
      onEmotionDetected(emotionResult);
    }
    
    toast({
      title: "Émotion détectée",
      description: `${emotionResult.emotion} (confiance: ${Math.round((emotionResult.confidence || 0) * 100)}%)`,
    });
    
    if (onScanComplete) {
      onScanComplete();
    }
  };

  const getEmotionColor = (emotion: string) => {
    return emotionColors[emotion as keyof typeof emotionColors] || 'bg-gray-200';
  };

  return (
    <Card className={cn("w-full", className)}>
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-center">
            Comment vous sentez-vous ?
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {showTabs && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className={compact ? 'hidden sm:inline' : ''}>Texte</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span className={compact ? 'hidden sm:inline' : ''}>Voix</span>
              </TabsTrigger>
              <TabsTrigger value="face" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span className={compact ? 'hidden sm:inline' : ''}>Visage</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              <form onSubmit={handleTextSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Sélectionnez votre émotion
                    </label>
                    <EmotionSelector
                      selectedEmotion={selectedEmotion}
                      onSelectEmotion={setSelectedEmotion}
                      emotions={primaryEmotions}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Intensité: {intensity}%
                    </label>
                    <Slider
                      value={[intensity]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(values) => setIntensity(values[0])}
                      className={cn(
                        selectedEmotion && getEmotionColor(selectedEmotion)
                      )}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Décrivez ce que vous ressentez (optionnel)
                    </label>
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Décrivez votre état émotionnel..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isProcessing || !selectedEmotion}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      'Enregistrer mon émotion'
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="voice">
              <VoiceEmotionAnalyzer 
                onEmotionDetected={handleEmotionDetected}
                compact={compact}
              />
            </TabsContent>
            
            <TabsContent value="face">
              <FacialEmotionScanner 
                onEmotionDetected={handleEmotionDetected}
                compact={compact}
              />
            </TabsContent>
          </Tabs>
        )}
        
        {scanResult && (
          <div className="mt-4 p-4 border rounded-md bg-muted/50">
            <h4 className="font-medium">Résultat de l'analyse</h4>
            <p>Émotion principale: <span className="font-semibold">{scanResult.emotion}</span></p>
            <p>Intensité: <span className="font-semibold">{scanResult.intensity || Math.round((scanResult.confidence || 0) * 100)}%</span></p>
            {scanResult.text && (
              <p className="mt-2 italic text-sm">{scanResult.text}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedEmotionCheckin;
