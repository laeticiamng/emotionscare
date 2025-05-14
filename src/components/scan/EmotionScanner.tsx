import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Camera, HelpCircle, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { EmotionResult } from '@/types';
import FacialEmotionScanner from './FacialEmotionScanner';
import VoiceEmotionScanner from './VoiceEmotionScanner';
import EmojiPicker from './EmojiPicker';
import { useToast } from '@/hooks/use-toast';

interface EmotionScannerProps {
  text: string;
  emojis: string;
  audioUrl: string | null;
  onTextChange: (text: string) => void;
  onEmojiChange: (emojis: string) => void;
  onAudioChange: (url: string | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onEmotionDetected?: (result: EmotionResult) => void;
}

const EmotionScanner: React.FC<EmotionScannerProps> = ({
  text,
  emojis,
  audioUrl,
  onTextChange,
  onEmojiChange,
  onAudioChange,
  onAnalyze,
  isAnalyzing,
  onEmotionDetected
}) => {
  const [activeTab, setActiveTab] = useState('text');
  const [facialResult, setFacialResult] = useState<EmotionResult | null>(null);
  const [voiceResult, setVoiceResult] = useState<EmotionResult | null>(null);
  const { toast } = useToast();

  const handleEmojiSelect = (emoji: string) => {
    onEmojiChange(emojis + emoji);
  };

  const handleClearEmojis = () => {
    onEmojiChange('');
  };

  const handleFacialScanComplete = (result: EmotionResult) => {
    setFacialResult(result);
    if (onEmotionDetected) {
      onEmotionDetected(result);
    }
    
    toast({
      title: "Scan facial complété",
      description: `Émotion détectée : ${result.emotion || 'inconnue'}`,
    });
  };

  const handleVoiceScanComplete = (result: EmotionResult) => {
    setVoiceResult(result);
    onAudioChange(result.audio_url || null);
    
    if (onEmotionDetected) {
      onEmotionDetected(result);
    }
    
    toast({
      title: "Analyse vocale complétée",
      description: `Émotion détectée : ${result.emotion || 'inconnue'}`,
    });
  };

  const isTabValid = () => {
    switch (activeTab) {
      case 'text':
        return text.trim().length > 0;
      case 'voice':
        return audioUrl !== null || voiceResult !== null;
      case 'face':
        return facialResult !== null;
      default:
        return false;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scanner mon émotion</CardTitle>
        <CardDescription>
          Choisissez la méthode qui vous convient le mieux
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="text">Texte</TabsTrigger>
            <TabsTrigger value="voice">Voix</TabsTrigger>
            <TabsTrigger value="face">Expression</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label>Décrivez ce que vous ressentez</Label>
              <Textarea
                placeholder="Je me sens..."
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Exprimez-vous avec des emojis</Label>
                {emojis && (
                  <Button variant="ghost" size="sm" onClick={handleClearEmojis}>
                    Effacer
                  </Button>
                )}
              </div>
              <div className="bg-muted/30 p-3 rounded-md min-h-[40px] text-lg">
                {emojis || <span className="text-muted-foreground text-sm">Cliquez ci-dessous pour ajouter des emojis</span>}
              </div>
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            </div>
          </TabsContent>

          <TabsContent value="voice">
            <VoiceEmotionScanner onScanComplete={(result) => {
              if (onEmotionDetected) {
                onEmotionDetected(result);
              }
              handleVoiceScanComplete(result);
            }} />
          </TabsContent>

          <TabsContent value="face">
            <FacialEmotionScanner onScanComplete={handleFacialScanComplete} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <HelpCircle className="h-4 w-4" />
          <span>Aide</span>
        </Button>
        
        <Button 
          onClick={onAnalyze}
          disabled={!isTabValid() || isAnalyzing}
          className="flex items-center gap-1"
        >
          <span>Analyser</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmotionScanner;
