/**
 * ScanFacialPage - Page de scan émotionnel par reconnaissance faciale
 */

import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowLeft, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import PageRoot from '@/components/common/PageRoot';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useEmotionScan } from '@/hooks/useEmotionScan';
import { useToast } from '@/hooks/use-toast';
import { EmotionResult, ConfidenceLevel } from '@/types/emotion-unified';

// Helper pour extraire la valeur numérique de confidence
const getConfidenceValue = (confidence: number | ConfidenceLevel | undefined): number => {
  if (confidence === undefined) return 0;
  if (typeof confidence === 'number') return confidence;
  return confidence.overall ?? 0;
};

// Simple Result Display Component
const SimpleResultCard: React.FC<{ result: EmotionResult }> = ({ result }) => {
  const getEmotionColor = (valence: number) => {
    if (valence > 60) return 'text-green-500';
    if (valence > 40) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const confidenceValue = getConfidenceValue(result.confidence);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className={getEmotionColor(result.valence || 50)}>●</span>
          Résultat de l'analyse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className={`text-2xl font-bold ${getEmotionColor(result.valence || 50)}`}>
            {result.emotion || 'Neutre'}
          </p>
          {result.summary && <p className="text-sm text-muted-foreground mt-1">{result.summary}</p>}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Valence</span>
            <span>{Math.round(result.valence || 50)}%</span>
          </div>
          <Progress value={result.valence || 50} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Arousal</span>
            <span>{Math.round(result.arousal || 50)}%</span>
          </div>
          <Progress value={result.arousal || 50} className="h-2" />
        </div>
        {confidenceValue > 0 && (
          <Badge variant="secondary">Confiance: {Math.round(confidenceValue)}%</Badge>
        )}
      </CardContent>
    </Card>
  );
};

const ScanFacialPage: React.FC = () => {
  usePageSEO({
    title: 'Scan Facial - Reconnaissance des émotions',
    description: 'Analysez vos émotions par reconnaissance faciale IA en temps réel.',
    keywords: 'scan facial, reconnaissance émotions, analyse visage, IA émotionnelle'
  });

  const { scanEmotion, isScanning, lastResult, reset } = useEmotionScan();
  const { toast } = useToast();
  const [cameraActive, setCameraActive] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      if (videoRef) {
        videoRef.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      toast({
        title: 'Accès caméra refusé',
        description: 'Veuillez autoriser l\'accès à la caméra pour utiliser cette fonctionnalité.',
        variant: 'destructive'
      });
    }
  }, [videoRef, toast]);

  const stopCamera = useCallback(() => {
    if (videoRef?.srcObject) {
      const tracks = (videoRef.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.srcObject = null;
    }
    setCameraActive(false);
  }, [videoRef]);

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.videoWidth;
    canvas.height = videoRef.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    try {
      await scanEmotion('camera', imageData, { saveToHistory: true });
      toast({
        title: '✅ Analyse terminée',
        description: 'Votre émotion a été détectée avec succès.'
      });
    } catch (error) {
      // Error handled in hook
    }
  }, [videoRef, scanEmotion, toast]);

  const handleReset = useCallback(() => {
    reset();
    stopCamera();
  }, [reset, stopCamera]);

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
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1 text-xs font-medium text-blue-500">
              <Camera className="h-4 w-4" />
              Reconnaissance faciale
            </span>
            <h1 className="text-4xl font-semibold text-foreground">
              Scan Facial IA
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Utilisez votre caméra pour une analyse instantanée de vos expressions faciales. 
              Notre IA détecte les micro-expressions et identifie votre état émotionnel.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Camera Section */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Caméra</CardTitle>
                <CardDescription>
                  Positionnez votre visage au centre de l'écran
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-video rounded-lg bg-muted overflow-hidden">
                  <video
                    ref={setVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!cameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <Camera className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  )}
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Analyse en cours...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!cameraActive ? (
                    <Button onClick={startCamera} className="flex-1 gap-2">
                      <Camera className="h-4 w-4" />
                      Activer la caméra
                    </Button>
                  ) : (
                    <>
                      <Button 
                        onClick={captureAndAnalyze} 
                        className="flex-1 gap-2"
                        disabled={isScanning}
                      >
                        {isScanning ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                        Capturer et analyser
                      </Button>
                      <Button variant="outline" onClick={stopCamera}>
                        Arrêter
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Result Section */}
            <div className="space-y-4">
              {lastResult ? (
                <>
                  <SimpleResultCard result={lastResult} />
                  <Button variant="outline" onClick={handleReset} className="w-full gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Nouveau scan
                  </Button>
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      Activez la caméra et capturez une image pour voir les résultats
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

export default ScanFacialPage;
