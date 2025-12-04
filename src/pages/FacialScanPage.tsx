import React, { useState, useEffect } from 'react';
import { Sentry } from '@/lib/errors/sentry-compat';
import { PageErrorBoundary } from '@/components/error/PageErrorBoundary';
import PageRoot from '@/components/common/PageRoot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CameraSampler from '@/features/scan/CameraSampler';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { ScanHistory } from '@/components/scan/ScanHistory';
import { MultiSourceChart } from '@/components/scan/MultiSourceChart';

const FacialScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [cameraStatus, setCameraStatus] = useState<'allowed' | 'denied' | null>(null);
  const [summary, setSummary] = useState<string | undefined>();

  useEffect(() => {
    Sentry.addBreadcrumb({ 
      category: 'scan', 
      level: 'info', 
      message: 'facial-scan:open' 
    });
  }, []);

  const handlePermissionChange = (status: 'allowed' | 'denied') => {
    setCameraStatus(status);
    Sentry.addBreadcrumb({
      category: 'scan',
      level: 'info',
      message: `facial-scan:camera:${status}`
    });
  };

  const handleUnavailable = (reason: 'edge' | 'hardware') => {
    Sentry.addBreadcrumb({
      category: 'scan',
      level: 'warning',
      message: `facial-scan:unavailable:${reason}`
    });
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
                    Analyse Faciale IA
                  </h1>
                </div>
                <p className="max-w-2xl text-base text-muted-foreground">
                  Analysez vos émotions en temps réel grâce à la reconnaissance faciale. 
                  Notre IA détecte les micro-expressions pour identifier votre état émotionnel.
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="space-y-6">
                <CameraSampler
                  onPermissionChange={handlePermissionChange}
                  onUnavailable={handleUnavailable}
                  summary={summary}
                />

                {cameraStatus === 'denied' && (
                  <Card className="border-destructive/50">
                    <CardHeader>
                      <CardTitle className="text-destructive">Accès caméra refusé</CardTitle>
                      <CardDescription>
                        Pour utiliser l'analyse faciale, veuillez autoriser l'accès à votre caméra.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Vous pouvez modifier cette autorisation dans les paramètres de votre navigateur.
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
                      <h4 className="font-medium text-foreground">1. Préparation</h4>
                      <p>Placez-vous face à la caméra dans un endroit bien éclairé.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">2. Autorisation</h4>
                      <p>Autorisez l'accès à votre caméra quand le navigateur le demande.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">3. Analyse</h4>
                      <p>Notre IA analyse vos expressions faciales toutes les 15 secondes.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">4. Résultats</h4>
                      <p>Découvrez votre état émotionnel détecté en temps réel.</p>
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
                      ✓ Analyse locale via IA sécurisée
                    </p>
                    <p>
                      ✓ Aucune image n'est stockée
                    </p>
                    <p>
                      ✓ Seul le résultat émotionnel est conservé
                    </p>
                    <p>
                      ✓ Données 100% confidentielles
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

export default FacialScanPage;
