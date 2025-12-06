import { useState, useEffect } from 'react';
import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import { PageErrorBoundary } from '@/components/error/PageErrorBoundary';
import PageRoot from '@/components/common/PageRoot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LiveVoiceScanner from '@/components/scan/live/LiveVoiceScanner';
import { EmotionResult } from '@/types/emotion-unified';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic } from 'lucide-react';
import { withGuard } from '@/routerV2/withGuard';
import { ScanHistory } from '@/components/scan/ScanHistory';
import { MultiSourceChart } from '@/components/scan/MultiSourceChart';

const VoiceScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    Sentry.addBreadcrumb({ 
      category: 'scan', 
      level: 'info', 
      message: 'voice-scan:open' 
    });
  }, []);

  const handleScanComplete = (result: EmotionResult) => {
    setScanResult(result);
    Sentry.addBreadcrumb({
      category: 'scan',
      level: 'info',
      message: 'voice-scan:complete',
      data: { 
        emotion: result.emotion,
        confidence: result.confidence 
      }
    });
  };

  const handleReset = () => {
    setScanResult(null);
    setIsProcessing(false);
  };

  return (
    <PageErrorBoundary route="/app/scan/voice" feature="voice-scan">
      <PageRoot>
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10">
          <div className="container mx-auto px-4 py-10">
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/app/scan')}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au scanner
              </Button>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Mic className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-4xl font-semibold text-foreground">
                    Analyse Vocale
                  </h1>
                </div>
                <p className="max-w-2xl text-base text-muted-foreground">
                  Analysez vos émotions à travers votre voix. Parlez naturellement pendant quelques secondes 
                  pour que notre IA détecte les nuances émotionnelles de votre discours.
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="space-y-6">
                <LiveVoiceScanner
                  onScanComplete={handleScanComplete}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                  scanDuration={10}
                  autoStart={false}
                />

                {scanResult && (
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
                        <span className="text-2xl">{scanResult.emotion}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Confiance</span>
                        <span className="text-lg font-semibold text-primary">
                          {typeof scanResult.confidence === 'number'
                            ? Math.round(scanResult.confidence)
                            : Math.round(scanResult.confidence.overall)}%
                        </span>
                      </div>
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
                    <CardTitle>Comment ça marche ?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">1. Préparation</h4>
                      <p>Trouvez un endroit calme et autorisez l'accès au microphone.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">2. Enregistrement</h4>
                      <p>Parlez naturellement pendant 10 secondes sur un sujet qui vous tient à cœur.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">3. Analyse</h4>
                      <p>Notre IA analyse les intonations, le rythme et le ton de votre voix.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">4. Résultats</h4>
                      <p>Recevez une analyse détaillée de votre état émotionnel.</p>
                    </div>
                  </CardContent>
                </Card>

                <ScanHistory />
                
                <MultiSourceChart />

                <Card>
                  <CardHeader>
                    <CardTitle>Confidentialité</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      ✓ Votre voix est analysée localement
                    </p>
                    <p>
                      ✓ Aucun enregistrement n'est conservé
                    </p>
                    <p>
                      ✓ Analyse 100% confidentielle
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

export default withGuard(VoiceScanPage, [{ type: 'auth', required: true }]);
