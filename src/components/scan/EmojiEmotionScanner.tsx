
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import { Loader2 } from 'lucide-react';

interface EmojiEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel?: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const emojis = [
  { emoji: '😊', emotion: 'joy', label: 'Joie' },
  { emoji: '😢', emotion: 'sadness', label: 'Tristesse' },
  { emoji: '😡', emotion: 'anger', label: 'Colère' },
  { emoji: '😨', emotion: 'fear', label: 'Peur' },
  { emoji: '😲', emotion: 'surprise', label: 'Surprise' },
  { emoji: '😌', emotion: 'calm', label: 'Calme' },
  { emoji: '😍', emotion: 'love', label: 'Amour' },
  { emoji: '😰', emotion: 'anxiety', label: 'Anxiété' },
];

const intensityLabels = [
  { value: 20, label: 'Très faible' },
  { value: 40, label: 'Faible' },
  { value: 60, label: 'Modéré' },
  { value: 80, label: 'Fort' },
  { value: 100, label: 'Très fort' },
];

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number | null>(null);
  
  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
  };
  
  const handleIntensitySelect = (value: number) => {
    setIntensity(value);
  };
  
  const handleAnalyze = async () => {
    if (!selectedEmoji || intensity === null || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedEmotionData = emojis.find(e => e.emotion === selectedEmoji);
      
      if (!selectedEmotionData) return;
      
      const result: EmotionResult = {
        emotion: selectedEmoji,
        intensity: intensity,
        source: 'emoji',
        score: intensity / 100,
        ai_feedback: `Vous avez indiqué ressentir de ${selectedEmotionData.label.toLowerCase()} à un niveau ${
          intensity <= 20 ? 'très faible' : 
          intensity <= 40 ? 'faible' : 
          intensity <= 60 ? 'modéré' : 
          intensity <= 80 ? 'fort' : 'très fort'
        }.`,
        date: new Date().toISOString(),
      };
      
      onScanComplete(result);
    } catch (error) {
      console.error('Error analyzing emoji selection:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Comment vous sentez-vous ?</h3>
        <div className="grid grid-cols-4 gap-3">
          {emojis.map((item) => (
            <button
              key={item.emotion}
              className={`p-3 rounded-lg text-center transition-all ${
                selectedEmoji === item.emotion
                  ? 'bg-primary/20 border border-primary'
                  : 'bg-muted/40 hover:bg-muted'
              }`}
              onClick={() => handleEmojiSelect(item.emotion)}
              disabled={isProcessing}
            >
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className="text-xs">{item.label}</div>
            </button>
          ))}
        </div>
      </div>
      
      {selectedEmoji && (
        <div>
          <h3 className="text-sm font-medium mb-3">À quelle intensité ?</h3>
          <div className="space-y-2">
            {intensityLabels.map((item) => (
              <button
                key={item.value}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  intensity === item.value
                    ? 'bg-primary/20 border border-primary'
                    : 'bg-muted/40 hover:bg-muted'
                }`}
                onClick={() => handleIntensitySelect(item.value)}
                disabled={isProcessing}
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
                <div className="mt-1 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={isProcessing}>
            Annuler
          </Button>
        )}
        
        <Button 
          onClick={handleAnalyze} 
          disabled={!selectedEmoji || intensity === null || isProcessing}
          className="ml-auto"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            'Analyser mon émotion'
          )}
        </Button>
      </div>
    </div>
  );
};

export default EmojiEmotionScanner;
