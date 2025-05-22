
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { emotions, Emotion, EmotionResult } from '@/types/emotion';
import { motion } from 'framer-motion';

interface EmojiEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel: () => void;
  onProcessingChange: (isProcessing: boolean) => void;
  disablePostProcessing?: boolean;
}

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  onProcessingChange,
  disablePostProcessing = false
}) => {
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [processing, setProcessing] = useState(false);
  const [intensity, setIntensity] = useState<number>(3);
  
  const handleSelectEmotion = (emotion: Emotion) => {
    const isSelected = selectedEmotions.some(e => e.name === emotion.name);
    
    if (isSelected) {
      setSelectedEmotions(selectedEmotions.filter(e => e.name !== emotion.name));
    } else {
      if (selectedEmotions.length < 2) {
        setSelectedEmotions([...selectedEmotions, emotion]);
      } else {
        setSelectedEmotions([selectedEmotions[1], emotion]);
      }
    }
  };
  
  const handleSubmit = async () => {
    if (selectedEmotions.length === 0) {
      return;
    }
    
    setProcessing(true);
    onProcessingChange(true);
    
    try {
      if (disablePostProcessing) {
        // Skip the processing simulation if disabled
        completeProcess();
        return;
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      completeProcess();
    } catch (error) {
      console.error('Error processing emotions:', error);
      setProcessing(false);
      onProcessingChange(false);
    }
  };
  
  const completeProcess = () => {
    const result: EmotionResult = {
      primaryEmotion: selectedEmotions[0].name,
      secondaryEmotion: selectedEmotions[1]?.name,
      intensity: intensity as 1 | 2 | 3 | 4 | 5,
      source: 'emoji',
      timestamp: new Date().toISOString()
    };
    
    onScanComplete(result);
    setProcessing(false);
    onProcessingChange(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-muted-foreground">
          Sélectionnez jusqu'à deux émotions qui représentent le mieux votre état actuel
        </p>
      </div>
      
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 max-h-60 overflow-y-auto p-2">
        {emotions.map((emotion) => (
          <motion.button
            key={emotion.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectEmotion(emotion)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-md transition-all",
              selectedEmotions.some(e => e.name === emotion.name)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
            title={emotion.label}
          >
            <span className="text-2xl">{emotion.emoji}</span>
            <span className="text-xs mt-1 line-clamp-1">{emotion.label}</span>
          </motion.button>
        ))}
      </div>
      
      <div className="space-y-3">
        <p className="text-sm text-center">Intensité: {intensity}/5</p>
        <input 
          type="range" 
          min="1" 
          max="5" 
          step="1"
          value={intensity}
          onChange={(e) => setIntensity(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Faible</span>
          <span>Modérée</span>
          <span>Forte</span>
        </div>
      </div>
      
      <div className="flex justify-between gap-4">
        <Button 
          variant="outline"
          onClick={onCancel}
          disabled={processing}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={selectedEmotions.length === 0 || processing}
          className="flex-1"
        >
          {processing ? 'Traitement...' : 'Valider'}
        </Button>
      </div>
    </div>
  );
};

export default EmojiEmotionScanner;
