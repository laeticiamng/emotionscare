import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { analyzeTextEmotion } from '@/lib/ai/emotion-service';
import { EmotionResult } from '@/types';

interface TextEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({ onResult }) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!text) {
      toast({
        title: "Veuillez entrer du texte",
        description: "Vous devez entrer du texte pour effectuer une analyse émotionnelle.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const analysis = await analyzeTextEmotion(text);
      if (analysis && analysis.length > 0) {
        const mainEmotion = analysis[0].emotion;
        const confidence = analysis[0].score;

        setResult({
          emotion: mainEmotion,
          dominantEmotion: mainEmotion, // This is now allowed in our type
          score: confidence * 100,
          confidence: confidence,
          text: text
        });

        if (onResult) {
          onResult({
            emotion: mainEmotion,
            dominantEmotion: mainEmotion,
            score: confidence * 100,
            confidence: confidence,
            text: text
          });
        }
      } else {
        toast({
          title: "Aucune émotion détectée",
          description: "Aucune émotion significative n'a été détectée dans le texte.",
        });
        setResult(null);
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
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        <div className="flex justify-end">
          <Button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? "Analyse en cours..." : "Analyser"}
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
