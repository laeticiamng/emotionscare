import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmotionScan } from '@/hooks/useEmotionScan';
import { EmotionResult } from '@/types/emotion-unified';
import { useToast } from '@/hooks/use-toast';
import { ScanHistory } from '@/components/scan/ScanHistory';

/**
 * Type guard to check if confidence is a number
 */
function isNumberConfidence(confidence: unknown): confidence is number {
  return typeof confidence === 'number';
}

/**
 * Safely extracts confidence value from EmotionResult
 */
function getConfidenceValue(confidence: EmotionResult['confidence']): number {
  if (isNumberConfidence(confidence)) {
    return Math.round(confidence);
  }

  if (confidence && typeof confidence === 'object' && 'overall' in confidence) {
    return Math.round(confidence.overall);
  }

  return 0;
}

export default function TextScanPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { scanEmotion, isScanning } = useEmotionScan();
  const [textInput, setTextInput] = useState('');
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);

  const handleScan = useCallback(async () => {
    if (!textInput.trim()) {
      toast({
        title: 'Texte requis',
        description: 'Veuillez saisir du texte pour analyser vos émotions',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await scanEmotion('text', textInput);
      if (result) {
        setScanResult(result);
        toast({
          title: 'Analyse terminée',
          description: 'Votre état émotionnel a été analysé avec succès',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'analyse',
        variant: 'destructive',
      });
    }
  }, [textInput, scanEmotion, toast]);

  const handleReset = () => {
    setTextInput('');
    setScanResult(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Analyse Textuelle</h1>
              <p className="text-muted-foreground">
                Exprimez vos émotions par écrit
              </p>
            </div>
          </div>
        </header>

        {!scanResult ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Comment vous sentez-vous ?
              </CardTitle>
              <CardDescription>
                Décrivez votre état émotionnel actuel en quelques phrases. Notre IA analysera vos mots pour identifier vos émotions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Aujourd'hui, je me sens..."
                className="min-h-[200px] resize-none"
                maxLength={1000}
                disabled={isScanning}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {textInput.length}/1000 caractères
                </span>
                <Button
                  onClick={handleScan}
                  disabled={!textInput.trim() || isScanning}
                  size="lg"
                >
                  {isScanning ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      Analyser mes émotions
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Résultat de l'analyse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">Émotion détectée</h3>
                  <p className="text-2xl font-bold text-primary capitalize">
                    {scanResult.emotion}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Confiance: {getConfidenceValue(scanResult.confidence)}%
                  </p>
                </div>

                {(scanResult.summary || scanResult.feedback || scanResult.ai_feedback) && (
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-semibold">Analyse</h3>
                    <p className="text-muted-foreground">
                      {scanResult.summary || scanResult.feedback || scanResult.ai_feedback}
                    </p>
                  </div>
                )}

                {scanResult.recommendations && scanResult.recommendations.length > 0 && (
                  <div>
                    <h3 className="mb-3 font-semibold">Recommandations</h3>
                    <ul className="space-y-2">
                      {scanResult.recommendations.map((recommendation) => {
                        const recText = typeof recommendation === 'string'
                          ? recommendation
                          : `${recommendation.title}: ${recommendation.description}`;
                        const uniqueKey = typeof recommendation === 'string'
                          ? recommendation
                          : `${recommendation.title}-${recommendation.description}`;
                        return (
                          <li key={uniqueKey} className="flex items-start gap-2">
                            <Sparkles className="mt-1 h-4 w-4 text-primary" />
                            <span className="text-sm">{recText}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  Nouvelle analyse
                </Button>
                <Button onClick={() => navigate('/app/scan')} className="flex-1">
                  Retour au scan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <ScanHistory />
      </div>
    </main>
  );
}
