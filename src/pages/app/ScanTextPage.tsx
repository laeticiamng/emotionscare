/**
 * ScanTextPage - Page de scan émotionnel par analyse textuelle
 */

import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, RefreshCw, Loader2, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import PageRoot from '@/components/common/PageRoot';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useEmotionScan } from '@/hooks/useEmotionScan';
import { useToast } from '@/hooks/use-toast';
import { EmotionResult, ConfidenceLevel } from '@/types/emotion-unified';
import Scene3DErrorBoundary from '@/components/3d/Scene3DErrorBoundary';

const EmotionSphere3D = lazy(() => import('@/components/3d/EmotionSphere3D'));

const getConfidenceValue = (confidence: number | ConfidenceLevel | undefined): number => {
  if (confidence === undefined) return 0;
  if (typeof confidence === 'number') return confidence;
  return confidence.overall ?? 0;
};

const SimpleResultCard: React.FC<{ result: EmotionResult }> = ({ result }) => {
  const confidenceValue = getConfidenceValue(result.confidence);
  return (
    <Card>
      <CardHeader><CardTitle>Résultat</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-2xl font-bold text-center">{result.emotion || 'Neutre'}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span>Valence</span><span>{Math.round(result.valence || 50)}%</span></div>
          <Progress value={result.valence || 50} className="h-2" />
        </div>
        {confidenceValue > 0 && <Badge variant="secondary">Confiance: {Math.round(confidenceValue)}%</Badge>}
      </CardContent>
    </Card>
  );
};

const PROMPTS = [
  "Comment vous sentez-vous en ce moment ?",
  "Décrivez votre journée jusqu'ici...",
  "Qu'est-ce qui vous préoccupe ?",
  "Partagez un moment positif récent",
];

const ScanTextPage: React.FC = () => {
  usePageSEO({
    title: 'Scan Textuel - Analyse des émotions par le texte',
    description: 'Exprimez-vous par écrit et découvrez votre état émotionnel grâce à l\'analyse IA.',
    keywords: 'scan textuel, analyse sentiments, NLP, IA émotionnelle, bien-être'
  });

  const { scanEmotion, isScanning, lastResult, reset } = useEmotionScan();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (text.trim().length < 10) {
      toast({
        title: 'Texte trop court',
        description: 'Écrivez au moins quelques phrases pour une analyse précise.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await scanEmotion('text', text, { saveToHistory: true });
      toast({
        title: '✅ Analyse terminée',
        description: 'Votre état émotionnel a été analysé.'
      });
    } catch (error) {
      // Error handled in hook
    }
  }, [text, scanEmotion, toast]);

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    setText(`${prompt}\n\n`);
  };

  const handleReset = useCallback(() => {
    reset();
    setText('');
    setSelectedPrompt(null);
  }, [reset]);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10">
        <div className="container mx-auto flex flex-col gap-8 px-4 py-10">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link to="/app/scan">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
            </Link>
          </div>

          <header className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-1 text-xs font-medium text-green-500">
              <FileText className="h-4 w-4" />
              Analyse textuelle
            </span>
            <h1 className="text-4xl font-semibold text-foreground">
              Scan Textuel IA
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Exprimez-vous librement par écrit. Notre IA analyse le sentiment, 
              le ton et les émotions présentes dans votre texte.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Exprimez-vous
                </CardTitle>
                <CardDescription>
                  Choisissez une suggestion ou écrivez librement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Prompts */}
                <div className="flex flex-wrap gap-2">
                  {PROMPTS.map((prompt) => (
                    <Badge
                      key={prompt}
                      variant={selectedPrompt === prompt ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => handlePromptSelect(prompt)}
                    >
                      {prompt.slice(0, 30)}...
                    </Badge>
                  ))}
                </div>

                {/* Textarea */}
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Écrivez ici ce que vous ressentez, ce qui vous préoccupe, ou simplement comment se passe votre journée..."
                  className="min-h-[200px] resize-none"
                  disabled={isScanning}
                />

                {/* Stats */}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{wordCount} mot{wordCount > 1 ? 's' : ''}</span>
                  <span>{charCount} caractère{charCount > 1 ? 's' : ''}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAnalyze} 
                    className="flex-1 gap-2"
                    disabled={isScanning || text.trim().length < 10}
                  >
                    {isScanning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Analyser
                  </Button>
                  {text.length > 0 && (
                    <Button variant="outline" onClick={() => setText('')}>
                      Effacer
                    </Button>
                  )}
                </div>

                {/* Tips */}
                <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">💡 Pour une meilleure analyse</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Soyez sincère et spontané</li>
                    <li>Décrivez vos sensations physiques</li>
                    <li>Mentionnez le contexte si pertinent</li>
                    <li>Plus le texte est long, plus l'analyse est précise</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Result Section */}
            <div className="space-y-4">
              {lastResult ? (
                <>
                  <Scene3DErrorBoundary>
                    <Suspense fallback={null}>
                      <EmotionSphere3D
                        valence={(lastResult.valence || 50) / 100}
                        arousal={(lastResult.arousal || 50) / 100}
                        className="w-full h-48 mb-4"
                      />
                    </Suspense>
                  </Scene3DErrorBoundary>
                  <SimpleResultCard result={lastResult} />
                  <Button variant="outline" onClick={handleReset} className="w-full gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Nouvelle analyse
                  </Button>
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      Écrivez quelques phrases et lancez l'analyse pour voir les résultats
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageRoot>
  );
};

export default ScanTextPage;
