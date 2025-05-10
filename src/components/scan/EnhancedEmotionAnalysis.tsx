
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { EnhancedEmotionResult } from '@/types/emotion';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check } from 'lucide-react';

interface EnhancedEmotionAnalysisProps {
  result: EnhancedEmotionResult;
}

const EnhancedEmotionAnalysis: React.FC<EnhancedEmotionAnalysisProps> = ({ result }) => {
  const [analysisResult, setAnalysisResult] = useState<{
    emotion: string;
    confidence: number;
    feedback: string;
    recommendations: string[];
  }>({
    emotion: 'Neutral',
    confidence: 50,
    feedback: 'No specific feedback available',
    recommendations: [],
  });
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (result) {
      setAnalysisResult({
        emotion: result.emotion,
        confidence: result.confidence,
        feedback: result.feedback || result.description || 'No specific feedback available', 
        recommendations: result.recommendations || result.improvement_tips || [],
      });
    }
  }, [result]);

  const handleCopyFeedback = () => {
    navigator.clipboard.writeText(analysisResult.feedback);
    setCopied(true);
    toast({
      title: "Copié!",
      description: "Le feedback a été copié dans le presse-papiers.",
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyse Émotionnelle Avancée</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Émotion Détectée</h2>
          <Badge variant="secondary">{analysisResult.emotion}</Badge>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Niveau de Confiance</h2>
          <div className="flex items-center space-x-2">
            <Slider
              defaultValue={[analysisResult.confidence]}
              max={100}
              step={1}
              disabled
            />
            <span>{analysisResult.confidence}%</span>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Feedback</h2>
          <div className="relative">
            <p className="text-sm text-muted-foreground">{analysisResult.feedback}</p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 rounded-full"
              onClick={handleCopyFeedback}
              disabled={copied}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Recommandations</h2>
          {analysisResult.recommendations.length > 0 ? (
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {analysisResult.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune recommandation spécifique.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedEmotionAnalysis;
