import { useState, useEffect } from 'react';
import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import { PageErrorBoundary } from '@/components/error/PageErrorBoundary';
import PageRoot from '@/components/common/PageRoot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmojiEmotionScanner } from '@/components/scan/EmojiEmotionScanner';
import { EmotionResult } from '@/types/emotion-unified';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smile, Sparkles, Heart, ThumbsUp } from 'lucide-react';
import { withGuard } from '@/routerV2/withGuard';
import { ScanHistory } from '@/components/scan/ScanHistory';
import { MultiSourceChart } from '@/components/scan/MultiSourceChart';
import { useToast } from '@/hooks/use-toast';

const EmojiScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'scan',
      level: 'info',
      message: 'emoji-scan:open'
    });
  }, []);

  const handleScanComplete = (result: EmotionResult) => {
    setScanResult(result);
    Sentry.addBreadcrumb({
      category: 'scan',
      level: 'info',
      message: 'emoji-scan:complete',
      data: {
        emotion: result.emotion,
        confidence: result.confidence
      }
    });
    toast({
      title: 'Analyse terminée',
      description: `Votre état émotionnel a été analysé avec succès`,
    });
  };

  const handleCancel = () => {
    setScanResult(null);
    setIsProcessing(false);
  };

  const handleReset = () => {
    setScanResult(null);
    setIsProcessing(false);
  };

  return (
    <PageErrorBoundary route="/app/scan/emoji" feature="emoji-scan">
      <PageRoot>
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10">
          <div className="container mx-auto px-4 py-10">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate('/app/scan')}
                className="mb-4"
                aria-label="Retour au scanner principal"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au scanner
              </Button>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Smile className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h1 className="text-4xl font-semibold text-foreground">
                    Analyse par Emojis
                  </h1>
                </div>
                <p className="max-w-2xl text-base text-muted-foreground">
                  Exprimez vos émotions de manière simple et ludique en sélectionnant les emojis
                  qui correspondent le mieux à votre état émotionnel actuel.
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="space-y-6">
                {!scanResult ? (
                  <EmojiEmotionScanner
                    onScanComplete={handleScanComplete}
                    onCancel={handleCancel}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                        Résultats de l'analyse
                      </CardTitle>
                      <CardDescription>
                        Votre état émotionnel basé sur vos choix d'emojis
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Émotion principale</span>
                        <span className="text-2xl capitalize">{scanResult.emotion}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Confiance</span>
                        <span className="text-lg font-semibold text-primary">
                          {typeof scanResult.confidence === 'number'
                            ? Math.round(scanResult.confidence)
                            : Math.round(scanResult.confidence.overall)}%
                        </span>
                      </div>
                      {scanResult.valence !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Tonalité émotionnelle</span>
                          <span className="text-sm">
                            {scanResult.valence > 0 ? 'Positif ✨' : scanResult.valence < 0 ? 'Négatif 🌧️' : 'Neutre ⚖️'}
                          </span>
                        </div>
                      )}
                      {scanResult.arousal !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Niveau d'énergie</span>
                          <span className="text-sm">
                            {scanResult.arousal > 0.7 ? 'Élevé ⚡' : scanResult.arousal > 0.4 ? 'Modéré 🌟' : 'Calme 🍃'}
                          </span>
                        </div>
                      )}
                      {scanResult.summary && (
                        <div className="rounded-lg bg-muted p-4">
                          <p className="text-sm text-muted-foreground">
                            {scanResult.summary}
                          </p>
                        </div>
                      )}
                      {scanResult.recommendations && scanResult.recommendations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Recommandations</h4>
                          <ul className="space-y-2">
                            {scanResult.recommendations.map((rec, idx) => {
                              const recText = typeof rec === 'string' ? rec : rec.title || rec.description;
                              return (
                                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <ThumbsUp className="mt-0.5 h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                                  <span>{recText}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="w-full"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Nouvelle analyse
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
                      Comment ça marche ?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">1. Sélection intuitive</h4>
                      <p>Choisissez un ou plusieurs emojis qui reflètent votre humeur actuelle.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">2. Combinaisons</h4>
                      <p>Vous pouvez sélectionner plusieurs emojis pour exprimer des émotions complexes.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">3. Analyse</h4>
                      <p>Notre algorithme analyse vos choix pour identifier votre état émotionnel global.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">4. Insights</h4>
                      <p>Recevez des recommandations personnalisées basées sur vos émotions.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                      Avantages de l'analyse emoji
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <span aria-hidden="true">✓</span>
                      <span>Méthode rapide et intuitive</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span aria-hidden="true">✓</span>
                      <span>Idéale pour exprimer des émotions complexes</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span aria-hidden="true">✓</span>
                      <span>Pas besoin de mots ou d'équipement spécial</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span aria-hidden="true">✓</span>
                      <span>Parfait pour un suivi quotidien</span>
                    </p>
                  </CardContent>
                </Card>

                <ScanHistory />

                <MultiSourceChart />

                <Card>
                  <CardHeader>
                    <CardTitle>Astuce</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      Pour une analyse plus précise, n'hésitez pas à combiner plusieurs emojis.
                      Par exemple, si vous vous sentez à la fois fatigué et heureux, sélectionnez
                      les deux types d'emojis correspondants.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </PageRoot>
    </PageErrorBoundary>
  );
};

export default withGuard(EmojiScanPage, [{ type: 'auth', required: true }]);
