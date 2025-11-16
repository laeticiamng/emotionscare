// @ts-nocheck
import { useState, useEffect } from 'react';
import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import { PageErrorBoundary } from '@/components/error/PageErrorBoundary';
import PageRoot from '@/components/common/PageRoot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FacialEmotionScanner from '@/components/scan/FacialEmotionScanner';
import { EmotionResult } from '@/types/emotion-unified';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Shield, Eye, Smile } from 'lucide-react';
import { withGuard } from '@/routerV2/withGuard';
import { ScanHistory } from '@/components/scan/ScanHistory';
import { MultiSourceChart } from '@/components/scan/MultiSourceChart';
import { useToast } from '@/hooks/use-toast';

const FacialScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'scan',
      level: 'info',
      message: 'facial-scan:open'
    });
  }, []);

  const handleScanComplete = (result: EmotionResult) => {
    setScanResult(result);
    Sentry.addBreadcrumb({
      category: 'scan',
      level: 'info',
      message: 'facial-scan:complete',
      data: {
        emotion: result.emotion,
        confidence: result.confidence
      }
    });
    toast({
      title: 'Analyse terminée',
      description: `Émotion détectée : ${result.emotion}`,
    });
  };

  const handleCancel = () => {
    setScanResult(null);
  };

  const handleReset = () => {
    setScanResult(null);
  };

  return (
    <PageErrorBoundary route="/app/scan/facial" feature="facial-scan">
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
                    <Camera className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h1 className="text-4xl font-semibold text-foreground">
                    Analyse Faciale
                  </h1>
                </div>
                <p className="max-w-2xl text-base text-muted-foreground">
                  Analysez vos émotions à travers vos expressions faciales. Notre IA détecte
                  les micro-expressions pour identifier votre état émotionnel avec précision.
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="space-y-6">
                {!scanResult ? (
                  <FacialEmotionScanner
                    onScanComplete={handleScanComplete}
                    onCancel={handleCancel}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Résultats de l'analyse</CardTitle>
                      <CardDescription>
                        Votre état émotionnel détecté
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
                          <span className="text-sm font-medium">Valence</span>
                          <span className="text-sm">
                            {scanResult.valence > 0 ? 'Positif' : scanResult.valence < 0 ? 'Négatif' : 'Neutre'}
                            ({Math.round(scanResult.valence * 100)}%)
                          </span>
                        </div>
                      )}
                      {scanResult.arousal !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Intensité</span>
                          <span className="text-sm">
                            {Math.round(scanResult.arousal * 100)}%
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
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="w-full"
                      >
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
                      <Smile className="h-5 w-5 text-primary" aria-hidden="true" />
                      Comment ça marche ?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">1. Activation caméra</h4>
                      <p>Autorisez l'accès à votre caméra et positionnez votre visage dans le cadre.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">2. Capture</h4>
                      <p>Une photo de votre visage sera capturée pour analyse.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">3. Analyse IA</h4>
                      <p>Notre IA analyse vos micro-expressions faciales en temps réel.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">4. Résultats</h4>
                      <p>Recevez une analyse détaillée de votre état émotionnel avec des recommandations.</p>
                    </div>
                  </CardContent>
                </Card>

                <ScanHistory />

                <MultiSourceChart />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                      Confidentialité
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <span aria-hidden="true">✓</span>
                      <span>Images traitées de manière sécurisée</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span aria-hidden="true">✓</span>
                      <span>Aucune photo n'est stockée sans votre consentement</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span aria-hidden="true">✓</span>
                      <span>Analyse 100% confidentielle et chiffrée</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span aria-hidden="true">✓</span>
                      <span>Conforme RGPD et normes de protection des données</span>
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" aria-hidden="true" />
                      Conseils pour une meilleure analyse
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <span aria-hidden="true">•</span>
                      <span>Assurez-vous d'avoir un bon éclairage</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span aria-hidden="true">•</span>
                      <span>Gardez votre visage bien visible dans le cadre</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span aria-hidden="true">•</span>
                      <span>Restez naturel, ne forcez pas vos expressions</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span aria-hidden="true">•</span>
                      <span>Évitez les mouvements brusques pendant la capture</span>
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

export default withGuard(FacialScanPage, [{ type: 'auth', required: true }]);
