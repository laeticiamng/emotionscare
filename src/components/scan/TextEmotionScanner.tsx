
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult, EmotionRecommendation } from '@/types/emotion';
import { getEmotionEmojis } from '@/utils/emotionUtils';

interface TextEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  placeholder?: string;
  isProcessing?: boolean;
  setIsProcessing?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({ 
  onResult,
  placeholder = "Décrivez ce que vous ressentez...",
  isProcessing: externalIsProcessing,
  setIsProcessing: externalSetIsProcessing
}) => {
  const [text, setText] = useState('');
  const [localIsProcessing, setLocalIsProcessing] = useState(false);
  
  // Use external state if provided, otherwise use local state
  const isProcessing = externalIsProcessing !== undefined ? externalIsProcessing : localIsProcessing;
  const setIsProcessing = externalSetIsProcessing || setLocalIsProcessing;
  
  const handleAnalyze = async () => {
    if (!text.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call for emotion analysis
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock emotions based on keywords in text
      let detectedEmotion = 'neutral';
      let confidenceScore = 0.7;
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes('content') || lowerText.includes('heureux') || lowerText.includes('bien')) {
        detectedEmotion = 'happy';
        confidenceScore = 0.85;
      } else if (lowerText.includes('triste') || lowerText.includes('déprimé')) {
        detectedEmotion = 'sad';
        confidenceScore = 0.88;
      } else if (lowerText.includes('colère') || lowerText.includes('énervé') || lowerText.includes('frustré')) {
        detectedEmotion = 'angry';
        confidenceScore = 0.9;
      } else if (lowerText.includes('peur') || lowerText.includes('stress') || lowerText.includes('anxieux')) {
        detectedEmotion = 'anxious';
        confidenceScore = 0.82;
      } else if (lowerText.includes('calme') || lowerText.includes('détendu') || lowerText.includes('paisible')) {
        detectedEmotion = 'calm';
        confidenceScore = 0.87;
      }
      
      const recommendations: EmotionRecommendation[] = [
        {
          type: "activity",
          title: "Activité recommandée",
          description: "Une activité adaptée à votre état émotionnel actuel",
          category: "general", 
          content: "Try a new activity"
        },
        {
          type: "music",
          title: "Playlist recommandée",
          description: "Des morceaux pour accompagner votre humeur",
          category: "music",
          content: "Listen to a curated playlist"
        }
      ];
      
      if (onResult) {
        const result: EmotionResult = {
          id: `text-${Date.now()}`,
          emotion: detectedEmotion,
          primaryEmotion: detectedEmotion,
          confidence: confidenceScore,
          intensity: 0.7,
          text: text,
          timestamp: new Date().toISOString(),
          recommendations: recommendations,
          emojis: getEmotionEmojis(detectedEmotion),
          emotions: {},
          source: 'text' // Added required source field
        };
        
        onResult(result);
      }
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="resize-none"
        disabled={isProcessing}
      />
      
      <Button 
        onClick={handleAnalyze} 
        disabled={!text.trim() || isProcessing} 
        className="w-full"
      >
        {isProcessing ? 'Analyse en cours...' : 'Analyser mon texte'}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        Décrivez vos émotions, ce que vous ressentez, ou partagez votre état d'esprit actuel.
      </p>
    </div>
  );
};

export default TextEmotionScanner;
