import { useState, useEffect, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import { PageErrorBoundary } from '@/components/error/PageErrorBoundary';
import PageRoot from '@/components/common/PageRoot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CameraSampler from '@/features/scan/CameraSampler';
import { useMoodPublisher } from '@/features/mood/useMoodPublisher';
import { withGuard } from '@/routerV2/withGuard';
import { useToast } from '@/hooks/use-toast';

const FacialScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scanActive, setScanActive] = useState(false);
  const [edgeAvailable, setEdgeAvailable] = useState(true);
  const [summary, setSummary] = useState<string>('');

  useEffect(() => {
    Sentry.addBreadcrumb({ 
      category: 'scan', 
      level: 'info', 
      message: 'facial-scan:open' 
    });
  }, []);

  const handlePermissionChange = useCallback((status: 'allowed' | 'denied') => {
    setPermissionGranted(status === 'allowed');
    if (status === 'allowed') {
      setScanActive(true);
      Sentry.addBreadcrumb({
        category: 'scan',
        level: 'info',
        message: 'facial-scan:camera:allowed'
      });
    } else {
      toast({
        title: 'Accès caméra refusé',
        description: 'Veuillez autoriser l\'accès à votre caméra pour utiliser l\'analyse faciale.',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const handleUnavailable = useCallback((reason: 'edge' | 'hardware') => {
    setEdgeAvailable(false);
    setScanActive(false);
    
    if (reason === 'edge') {
      toast({
        title: 'Service temporairement indisponible',
        description: 'L\'analyse faciale est momentanément indisponible. Veuillez réessayer plus tard.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Caméra non disponible',
        description: 'Aucune caméra n\'a été détectée sur votre appareil.',
        variant: 'destructive'
      });
    }
  }, [toast]);

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
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au scanner
              </Button>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-4xl font-semibold text-foreground">
                    Scan Facial
                  </h1>
                </div>
                <p className="max-w-2xl text-base text-muted-foreground">
                  Analysez vos émotions en temps réel grâce à la reconnaissance faciale. 
                  Notre IA détecte 48 émotions différentes pour un suivi précis de votre état émotionnel.
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="space-y-6">
                <CameraSampler
                  summary={summary}
                  onPermissionChange={handlePermissionChange}
                  onUnavailable={handleUnavailable}
                />

                {scanActive && summary && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        État émotionnel détecté
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-medium text-foreground">
                        {summary}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        L'analyse continue en temps réel. Les résultats sont mis à jour automatiquement.
                      </p>
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
                      <h4 className="font-medium text-foreground">1. Autorisation caméra</h4>
                      <p>Autorisez l'accès à votre caméra pour commencer l'analyse.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">2. Positionnement</h4>
                      <p>Placez votre visage face à la caméra dans un environnement bien éclairé.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">3. Analyse en temps réel</h4>
                      <p>Notre IA Hume analyse vos micro-expressions pour détecter 48 émotions différentes.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">4. Résultats instantanés</h4>
                      <p>Recevez une analyse continue de votre état émotionnel en temps réel.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Technologie Hume AI</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      ✓ Détection de 48 émotions complètes
                    </p>
                    <p>
                      ✓ Analyse basée sur la recherche scientifique
                    </p>
                    <p>
                      ✓ Modèle circumplex valence/arousal
                    </p>
                    <p>
                      ✓ Précision professionnelle
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Confidentialité</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      ✓ Analyse sécurisée via API chiffrée
                    </p>
                    <p>
                      ✓ Aucune image n'est stockée
                    </p>
                    <p>
                      ✓ Seuls les résultats émotionnels sont conservés
                    </p>
                    <p>
                      ✓ Conformité RGPD
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
