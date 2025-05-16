
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { analyzeEmotion } from '@/lib/scanService';
import { EmotionResult } from '@/types/emotion';
import { v4 as uuid } from 'uuid';
import { useToast } from '@/hooks/use-toast';

interface TextEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  placeholder?: string;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({
  onResult,
  placeholder = "Décrivez comment vous vous sentez en ce moment..."
}) => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "Texte requis",
        description: "Veuillez entrer du texte pour l'analyse émotionnelle",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeEmotion(text);
      
      if (onResult) {
        onResult(result);
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      toast({
        title: "Erreur d'analyse",
        description: "Une erreur est survenue lors de l'analyse du texte",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
      />
      
      <Button 
        onClick={handleAnalyze} 
        disabled={isAnalyzing || !text.trim()} 
        className="w-full"
      >
        {isAnalyzing ? "Analyse en cours..." : "Analyser mon texte"}
      </Button>
    </div>
  );
};

export default TextEmotionScanner;
