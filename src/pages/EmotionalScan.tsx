import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Mic, Camera, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface EmotionResult {
  emotion: string;
  confidence: number;
  intensity: number;
  description: string;
  color: string;
}

export const EmotionalScan: React.FC = () => {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<EmotionResult[]>([]);
  const [scanMethod, setScanMethod] = useState<'voice' | 'video' | 'text'>('voice');
  const [hasPermissions, setHasPermissions] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Demander les permissions pour caméra/micro
  useEffect(() => {
    checkPermissions();
  }, [scanMethod]);

  const checkPermissions = async () => {
    try {
      if (scanMethod === 'voice') {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } else if (scanMethod === 'video') {
        await navigator.mediaDevices.getUserMedia({ video: true });
      }
      setHasPermissions(true);
    } catch (error) {
      setHasPermissions(false);
      toast.error('Permissions requises pour utiliser cette fonctionnalité');
    }
  };

  const startScan = async () => {
    if (!hasPermissions) {
      await checkPermissions();
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanResults([]);

    // Simulation du scan avec progression
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeScan();
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const completeScan = () => {
    // Résultats simulés - en production, cela viendrait d'une API d'IA
    const mockResults: EmotionResult[] = [
      {
        emotion: 'Calme',
        confidence: 0.85,
        intensity: 0.7,
        description: 'Vous semblez dans un état de tranquillité et de sérénité',
        color: 'bg-blue-500'
      },
      {
        emotion: 'Légèrement Anxieux',
        confidence: 0.65,
        intensity: 0.4,
        description: 'Une trace d\'anxiété légère est détectée',
        color: 'bg-yellow-500'
      },
      {
        emotion: 'Concentré',
        confidence: 0.78,
        intensity: 0.8,
        description: 'Vous montrez des signes de concentration élevée',
        color: 'bg-green-500'
      }
    ];

    setScanResults(mockResults);
    setIsScanning(false);
    toast.success('Scan émotionnel terminé !');
  };

  const stopScan = () => {
    setIsScanning(false);
    setScanProgress(0);
    toast.info('Scan interrompu');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Connexion requise</h3>
            <p className="text-muted-foreground">
              Vous devez être connecté pour utiliser le scan émotionnel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Brain className="h-10 w-10 text-primary" />
            Scan Émotionnel
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analysez votre état émotionnel en temps réel grâce à notre intelligence artificielle avancée
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Panneau de contrôle */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Méthode de scan</CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez effectuer votre scan émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sélection de méthode */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { method: 'voice' as const, icon: Mic, label: 'Vocal' },
                  { method: 'video' as const, icon: Camera, label: 'Vidéo' },
                  { method: 'text' as const, icon: Activity, label: 'Texte' },
                ].map(({ method, icon: Icon, label }) => (
                  <button
                    key={method}
                    onClick={() => setScanMethod(method)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2",
                      scanMethod === method
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>

              {/* Status des permissions */}
              <div className={cn(
                "flex items-center gap-2 p-3 rounded-lg",
                hasPermissions ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-700"
              )}>
                {hasPermissions ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span className="text-sm">
                  {hasPermissions 
                    ? "Permissions accordées" 
                    : "Permissions requises pour cette méthode"
                  }
                </span>
              </div>

              {/* Contrôles de scan */}
              <div className="space-y-4">
                {!isScanning ? (
                  <Button
                    onClick={startScan}
                    size="lg"
                    className="w-full"
                    disabled={!hasPermissions}
                  >
                    <Brain className="mr-2 h-5 w-5" />
                    Commencer le scan
                  </Button>
                ) : (
                  <Button
                    onClick={stopScan}
                    variant="destructive"
                    size="lg"
                    className="w-full"
                  >
                    Arrêter le scan
                  </Button>
                )}

                {isScanning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyse en cours...</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Zone de visualisation */}
          <div className="space-y-6">
            {/* Aperçu vidéo (si méthode vidéo sélectionnée) */}
            {scanMethod === 'video' && (
              <Card>
                <CardContent className="p-6">
                  <video
                    ref={videoRef}
                    className="w-full rounded-lg bg-muted"
                    autoPlay
                    muted
                    playsInline
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </CardContent>
              </Card>
            )}

            {/* Résultats du scan */}
            {scanResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Résultats du scan</CardTitle>
                  <CardDescription>
                    Votre analyse émotionnelle actuelle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scanResults.map((result, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-4 h-4 rounded-full", result.color)} />
                          <span className="font-medium">{result.emotion}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(result.confidence * 100)}% de confiance
                        </span>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={cn("h-2 rounded-full", result.color)}
                          style={{ width: `${result.intensity * 100}%` }}
                        />
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {result.description}
                      </p>
                    </div>
                  ))}
                  
                  <div className="mt-6 pt-4 border-t">
                    <Button className="w-full" variant="outline">
                      Sauvegarder les résultats
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};