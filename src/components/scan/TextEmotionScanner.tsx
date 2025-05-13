import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmotionResult, TextEmotionScannerProps } from '@/types/emotion';
import { ReloadIcon } from '@radix-ui/react-icons';

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({ 
  onEmotionDetected,
  text = '',
  onTextChange,
  onAnalyze,
  isAnalyzing = false
}) => {
  const [localText, setLocalText] = useState(text);
  const [localIsAnalyzing, setLocalIsAnalyzing] = useState(isAnalyzing);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setLocalText(newText);
    if (onTextChange) onTextChange(newText);
  };
  
  const handleAnalyze = async () => {
    if (!localText.trim()) return;
    
    try {
      // Use external function if provided
      if (onAnalyze) {
        onAnalyze();
        return;
      }
      
      // Otherwise handle internally
      setLocalIsAnalyzing(true);
      
      // Simulate emotion analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock emotion result
      const result: EmotionResult = {
        emotions: [
          { name: 'happiness', intensity: 0.7 },
          { name: 'calm', intensity: 0.5 },
          { name: 'optimism', intensity: 0.6 }
        ],
        dominantEmotion: { name: 'happiness', intensity: 0.7 },
        source: 'text',
        timestamp: new Date().toISOString(),
        text: localText
      };
      
      // Notify parent component
      if (onEmotionDetected) {
        onEmotionDetected(result);
      }
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setLocalIsAnalyzing(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyseur émotionnel textuel</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Décrivez ce que vous ressentez en ce moment..."
          className="min-h-[120px] resize-none"
          value={localText}
          onChange={handleTextChange}
          disabled={isAnalyzing || localIsAnalyzing}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleAnalyze}
          disabled={isAnalyzing || localIsAnalyzing || !localText.trim()}
        >
          {(isAnalyzing || localIsAnalyzing) ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            'Analyser'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TextEmotionScanner;
