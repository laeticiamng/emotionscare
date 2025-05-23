
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Camera, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const ScanPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  
  const startScan = async () => {
    setIsScanning(true);
    setScanComplete(false);
    setScanResult(null);
    
    try {
      // Simuler un processus de scan
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Génération d'un résultat aléatoire
      const emotions = ['Calme', 'Joie', 'Sérénité', 'Fatigue', 'Stress léger', 'Optimisme'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      setScanResult(randomEmotion);
      setScanComplete(true);
      toast.success('Scan émotionnel terminé');
      
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      toast.error('Erreur lors du scan émotionnel');
    } finally {
      setIsScanning(false);
    }
  };
  
  const resetScan = () => {
    setScanComplete(false);
    setScanResult(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <h1 className="text-3xl font-bold mb-8 text-center">Scan émotionnel</h1>
      
      <Card className="max-w-md w-full overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-primary/10 h-64 flex items-center justify-center">
            {isScanning ? (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-primary"
              >
                <Loader2 className="h-16 w-16 animate-spin" />
              </motion.div>
            ) : scanComplete ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-medium">Résultat du scan</h2>
                <p className="text-lg mt-2">État émotionnel détecté: <strong>{scanResult}</strong></p>
              </motion.div>
            ) : (
              <div className="text-center p-6">
                <Camera className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Prêt à analyser votre état émotionnel actuel. Cliquez sur le bouton ci-dessous pour commencer le scan.
                </p>
              </div>
            )}
          </div>
          
          <div className="p-6">
            {scanComplete ? (
              <Button 
                className="w-full" 
                onClick={resetScan}
              >
                Nouveau scan
              </Button>
            ) : (
              <Button 
                className="w-full" 
                onClick={startScan}
                disabled={isScanning}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Scan en cours...
                  </>
                ) : (
                  'Démarrer le scan'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {scanComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center max-w-md"
        >
          <p className="text-muted-foreground mb-4">
            Basé sur votre état émotionnel actuel, nous vous recommandons:
          </p>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            {scanResult === 'Stress léger' || scanResult === 'Fatigue' ? (
              <p>Une session de méditation guidée de 10 minutes pour vous aider à vous recentrer.</p>
            ) : scanResult === 'Joie' || scanResult === 'Optimisme' ? (
              <p>Maintenir cette énergie positive avec une playlist musicale adaptée à votre humeur.</p>
            ) : (
              <p>Une session de respiration profonde pour maintenir votre équilibre émotionnel.</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ScanPage;
