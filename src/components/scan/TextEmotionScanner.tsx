
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { EmotionResult } from '@/types/emotion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import useHumeAI from '@/hooks/api/useHumeAI';

interface TextEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [text, setText] = useState('');
  const { analyzeTextEmotion, isAnalyzing } = useHumeAI();
  
  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Veuillez saisir du texte à analyser');
      return;
    }
    
    if (text.trim().length < 10) {
      toast.error('Veuillez saisir au moins 10 caractères pour une analyse précise');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await analyzeTextEmotion(text.trim());
      if (result) {
        onScanComplete(result);
        toast.success('Analyse textuelle terminée');
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse du texte:', error);
      toast.error('Erreur lors de l\'analyse du texte');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const suggestedPrompts = [
    "Je me sens vraiment bien aujourd'hui, plein d'énergie pour affronter la journée.",
    "J'ai des difficultés à me concentrer et je me sens un peu démotivé ces derniers temps.",
    "Je suis excité par ce nouveau projet qui démarre bientôt.",
    "Je me sens stressé par toutes ces échéances qui arrivent."
  ];
  
  const handlePromptClick = (prompt: string) => {
    setText(prompt);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse textuelle</CardTitle>
        <CardDescription>
          Décrivez vos sentiments et émotions actuelles pour une analyse personnalisée
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="emotion-text">Comment vous sentez-vous ?</Label>
          <Textarea
            id="emotion-text"
            placeholder="Décrivez vos émotions, votre humeur, ce que vous ressentez en ce moment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-32"
            disabled={isProcessing || isAnalyzing}
          />
          <div className="text-xs text-muted-foreground">
            {text.length}/500 caractères • Minimum 10 caractères requis
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-sm">Suggestions pour vous aider :</Label>
          <div className="grid gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 text-left justify-start text-wrap"
                onClick={() => handlePromptClick(prompt)}
                disabled={isProcessing || isAnalyzing}
              >
                <span className="text-sm">{prompt}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            disabled={isProcessing || isAnalyzing}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleAnalyze} 
            disabled={isProcessing || isAnalyzing || text.trim().length < 10}
          >
            {isProcessing || isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              'Analyser mon texte'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextEmotionScanner;
