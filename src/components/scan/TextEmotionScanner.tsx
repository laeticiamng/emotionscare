
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult, TextEmotionScannerProps } from '@/types/emotion';

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({ onResult, onProcessingChange, isProcessing, setIsProcessing }) => {
  const [text, setText] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use external state if provided, otherwise use local state
  const isLoading = isProcessing !== undefined ? isProcessing : processing;
  const setIsLoading = setIsProcessing || setProcessing;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    
    // Call onProcessingChange if provided
    if (onProcessingChange) {
      onProcessingChange(true);
    }
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Mock emotion detection
      const result: EmotionResult = {
        id: `text-${Date.now()}`,
        emotion: getRandomEmotion(text),
        primaryEmotion: getRandomEmotion(text), // Added for component compatibility
        confidence: 0.7 + Math.random() * 0.2,
        intensity: 0.6 + Math.random() * 0.3,
        source: 'text',
        timestamp: new Date().toISOString(),
        text: text,
        emojis: getEmojisForText(text),
        recommendations: [
          {
            title: "Pratiquez la pleine conscience",
            description: "Prenez 5 minutes pour vous concentrer sur votre respiration"
          },
          {
            title: "Écoutez de la musique apaisante",
            description: "Une playlist de musique calme peut aider à équilibrer vos émotions"
          }
        ],
        score: Math.round((0.6 + Math.random() * 0.3) * 100) // Added for component compatibility
      };
      
      if (onResult) {
        onResult(result);
      }
      
      // Call onProcessingChange if provided
      if (onProcessingChange) {
        onProcessingChange(false);
      }
      setIsLoading(false);
    }, 1500);
  };

  // Utility function to get a random emotion based on text
  const getRandomEmotion = (text: string): string => {
    const positiveWords = ["heureux", "content", "joie", "super", "bien", "agréable", "bon", "satisfait"];
    const negativeWords = ["triste", "déprimé", "malheureux", "mauvais", "difficile", "pénible", "mal"];
    
    const lowerText = text.toLowerCase();
    
    let isPositive = positiveWords.some(word => lowerText.includes(word));
    let isNegative = negativeWords.some(word => lowerText.includes(word));
    
    if (isPositive && !isNegative) return "happy";
    if (isNegative && !isPositive) return "sad";
    if (isPositive && isNegative) return "mixed";
    
    // If no clear emotions detected, return one of these common states
    const emotions = ["neutral", "calm", "thoughtful", "focused"];
    return emotions[Math.floor(Math.random() * emotions.length)];
  };
  
  // Get emojis based on detected emotion
  const getEmojisForText = (text: string): string[] => {
    const emotion = getRandomEmotion(text);
    
    switch (emotion) {
      case "happy": return ["😊", "😄", "🙂"];
      case "sad": return ["😔", "😢", "🙁"];
      case "mixed": return ["😐", "🤔", "😕"];
      case "neutral": return ["😐", "😶"];
      case "calm": return ["😌", "🧘"];
      case "thoughtful": return ["🤔", "🧐"];
      case "focused": return ["🧐", "🤓"];
      default: return ["😐"];
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Partagez ce que vous ressentez</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea 
          placeholder="Décrivez vos émotions et sentiments actuels..."
          value={text}
          onChange={handleTextChange}
          disabled={isLoading}
          ref={textareaRef}
          rows={5}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Plus votre description est précise, plus l'analyse sera pertinente.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={text.trim().length < 10 || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
              Analyse en cours...
            </>
          ) : (
            'Analyser mes émotions'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TextEmotionScanner;
