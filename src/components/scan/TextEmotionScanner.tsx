import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { EmotionResult } from '@/types';

interface TextEmotionScannerProps {
  text?: string;
  onTextChange?: (text: string) => void;
  onResult?: (result: EmotionResult) => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({ 
  text: externalText, 
  onTextChange: externalOnTextChange,
  onResult,
  onAnalyze: externalOnAnalyze,
  isAnalyzing: externalIsAnalyzing
}) => {
  const [internalText, setInternalText] = useState('');
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Determine if we're in controlled or uncontrolled mode
  const isControlled = typeof externalText !== 'undefined';
  const text = isControlled ? externalText : internalText;
  const isAnalyzing = externalIsAnalyzing || isLoading;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (isControlled && externalOnTextChange) {
      externalOnTextChange(newText);
    } else {
      setInternalText(newText);
    }
  };

  const handleAnalyze = async () => {
    if (!text) {
      toast({
        title: "Veuillez entrer du texte",
        description: "Vous devez entrer du texte pour effectuer une analyse émotionnelle.",
        variant: "destructive",
      });
      return;
    }

    // If we have an external analyze handler, use it
    if (externalOnAnalyze) {
      externalOnAnalyze();
      return;
    }

    // Otherwise, do our own analysis
    setIsLoading(true);
    try {
      // Simulate analysis with a mock response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAnalysis = {
        emotion: 'calm',
        score: 75,
        confidence: 0.75,
        text: text
      };

      setResult(mockAnalysis);

      if (onResult) {
        onResult(mockAnalysis);
      }
    } catch (error) {
      console.error("Error analyzing text:", error);
      toast({
        title: "Erreur d'analyse",
        description: "Une erreur s'est produite lors de l'analyse du texte.",
        variant: "destructive",
      });
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse émotionnelle par texte</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Entrez votre texte ici..."
          value={text}
          onChange={handleTextChange}
          disabled={isAnalyzing}
        />
        <div className="flex justify-end">
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? "Analyse en cours..." : "Analyser"}
          </Button>
        </div>
        {result && (
          <div className="mt-4">
            <p>
              Émotion dominante: {result.emotion} (Confiance: {result.confidence?.toFixed(2)})
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextEmotionScanner;
