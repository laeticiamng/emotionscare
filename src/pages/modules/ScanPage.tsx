/**
 * ScanPage - Module de scan émotionnel
 * Interface pour analyser l'état émotionnel de l'utilisateur
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Mic, 
  Activity, 
  Heart,
  Brain,
  Zap,
  CheckCircle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmotionResult {
  emotion: string;
  confidence: number;
  color: string;
  icon: React.ElementType;
  description: string;
}

const ScanPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([]);

  const emotions: EmotionResult[] = [
    { 
      emotion: 'Calme', 
      confidence: 85, 
      color: 'text-blue-600', 
      icon: Heart,
      description: 'Vous semblez détendu et serein'
    },
    { 
      emotion: 'Énergique', 
      confidence: 92, 
      color: 'text-orange-600', 
      icon: Zap,
      description: 'Votre niveau d\'énergie est élevé'
    },
    { 
      emotion: 'Concentré', 
      confidence: 78, 
      color: 'text-purple-600', 
      icon: Brain,
      description: 'Vous êtes dans un état de focus'
    },
    { 
      emotion: 'Joyeux', 
      confidence: 88, 
      color: 'text-green-600', 
      icon: CheckCircle,
      description: 'Votre humeur est positive'
    }
  ];

  const startScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);

    // Simulation du scan
    const duration = 3000;
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          // Sélectionner une émotion aléatoire
          const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
          setScanResult(randomEmotion);
          setScanHistory(prev => [randomEmotion, ...prev.slice(0, 4)]);
          
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);
  };

  const resetScan = () => {
    setScanResult(null);
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <Activity className="h-8 w-8 text-blue-600" />
            Scan Émotionnel
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Analysez votre état émotionnel actuel grâce à notre technologie d'IA avancée
          </p>
        </motion.div>

        {/* Scan Interface */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Camera className="h-5 w-5" />
                Interface de Scan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Zone de scan */}
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <AnimatePresence mode="wait">
                  {!isScanning && !scanResult && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="text-center space-y-4">
                        <Camera className="h-16 w-16 mx-auto text-gray-400" />
                        <p className="text-muted-foreground">
                          Cliquez sur "Démarrer le scan" pour analyser votre état
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {isScanning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-blue-500/10"
                    >
                      <div className="text-center space-y-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Activity className="h-16 w-16 mx-auto text-blue-600" />
                        </motion.div>
                        <div className="space-y-2">
                          <p className="font-medium">Analyse en cours...</p>
                          <Progress value={scanProgress} className="w-48 mx-auto" />
                          <p className="text-sm text-muted-foreground">{scanProgress}%</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {scanResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 flex items-center justify-center bg-green-500/10"
                    >
                      <div className="text-center space-y-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                        >
                          <scanResult.icon className={`h-16 w-16 mx-auto ${scanResult.color}`} />
                        </motion.div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold">{scanResult.emotion}</h3>
                          <Badge variant="secondary" className="text-sm">
                            Confiance: {scanResult.confidence}%
                          </Badge>
                          <p className="text-muted-foreground">{scanResult.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contrôles */}
              <div className="flex justify-center gap-3">
                {!isScanning && !scanResult && (
                  <Button onClick={startScan} size="lg" className="gap-2">
                    <Camera className="h-4 w-4" />
                    Démarrer le scan
                  </Button>
                )}

                {scanResult && (
                  <>
                    <Button onClick={resetScan} variant="outline" size="lg" className="gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Nouveau scan
                    </Button>
                    <Button size="lg" className="gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Voir recommandations
                    </Button>
                  </>
                )}
              </div>

              {/* Options de scan */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Camera className="h-8 w-8 text-blue-600 bg-blue-100 p-2 rounded-lg" />
                    <div>
                      <div className="font-medium">Scan visuel</div>
                      <div className="text-sm text-muted-foreground">Analyse faciale</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Mic className="h-8 w-8 text-green-600 bg-green-100 p-2 rounded-lg" />
                    <div>
                      <div className="font-medium">Scan vocal</div>
                      <div className="text-sm text-muted-foreground">Analyse tonale</div>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historique */}
        {scanHistory.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle>Historique des scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {scanHistory.map((result, index) => (
                    <Card key={index} className="text-center p-4">
                      <result.icon className={`h-8 w-8 mx-auto mb-2 ${result.color}`} />
                      <div className="font-medium">{result.emotion}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.confidence}% de confiance
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScanPage;