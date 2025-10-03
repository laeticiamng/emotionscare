import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, TrendingUp, Award, Zap, Heart, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ScanResult {
  emotion: string;
  confidence: number;
  color: string;
  insight: string;
  recommendation: string;
}

const SCAN_STAGES = [
  { id: 1, name: 'Préparation', duration: 2000, description: 'Installez-vous confortablement' },
  { id: 2, name: 'Calibration', duration: 3000, description: 'Détection de votre état initial' },
  { id: 3, name: 'Analyse profonde', duration: 4000, description: 'Scan émotionnel en cours' },
  { id: 4, name: 'Synthèse', duration: 2000, description: 'Génération des insights' },
];

const EMOTION_COLORS = {
  joy: 'hsl(45, 90%, 60%)',
  calm: 'hsl(200, 70%, 60%)',
  energized: 'hsl(25, 85%, 55%)',
  focused: 'hsl(280, 60%, 65%)',
  relaxed: 'hsl(160, 50%, 60%)',
};

export default function EmotionScanJourneyPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [totalScans, setTotalScans] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('emotionScanHistory');
    if (stored) {
      const history = JSON.parse(stored);
      setScanHistory(history);
      setTotalScans(history.length);
    }
    const storedStreak = localStorage.getItem('emotionScanStreak');
    if (storedStreak) setStreak(parseInt(storedStreak));
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setCurrentStage(0);
    setScanProgress(0);
    setScanResult(null);

    let stageIndex = 0;
    let totalDuration = SCAN_STAGES.reduce((acc, stage) => acc + stage.duration, 0);
    let elapsed = 0;

    const processStage = () => {
      if (stageIndex >= SCAN_STAGES.length) {
        completeScan();
        return;
      }

      const stage = SCAN_STAGES[stageIndex];
      const startTime = Date.now();

      const interval = setInterval(() => {
        const now = Date.now();
        const stageElapsed = now - startTime;
        elapsed += 16;

        setScanProgress((elapsed / totalDuration) * 100);

        if (stageElapsed >= stage.duration) {
          clearInterval(interval);
          stageIndex++;
          setCurrentStage(stageIndex);
          processStage();
        }
      }, 16);
    };

    processStage();
  };

  const completeScan = () => {
    const emotions = ['joy', 'calm', 'energized', 'focused', 'relaxed'];
    const insights = {
      joy: 'Votre énergie positive rayonne ! Profitez de ce moment pour partager votre joie.',
      calm: 'Vous êtes dans un état de sérénité profonde. Idéal pour la réflexion.',
      energized: 'Votre dynamisme est au top ! Canalisez cette énergie dans vos projets.',
      focused: 'Votre concentration est optimale. Moment parfait pour les tâches importantes.',
      relaxed: 'Votre corps et esprit sont détendus. Savourez cette tranquillité.',
    };
    const recommendations = {
      joy: '🎵 Écoutez de la musique entraînante et dansez !',
      calm: '🧘 Méditez ou pratiquez le yoga pour approfondir cet état.',
      energized: '🏃 Faites du sport ou commencez un nouveau projet créatif.',
      focused: '📚 Travaillez sur vos objectifs les plus ambitieux.',
      relaxed: '🌿 Promenez-vous dans la nature ou lisez un bon livre.',
    };

    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = Math.floor(Math.random() * 15 + 85);

    const result: ScanResult = {
      emotion: randomEmotion,
      confidence,
      color: EMOTION_COLORS[randomEmotion],
      insight: insights[randomEmotion],
      recommendation: recommendations[randomEmotion],
    };

    setScanResult(result);
    setIsScanning(false);

    const newHistory = [result, ...scanHistory].slice(0, 10);
    setScanHistory(newHistory);
    localStorage.setItem('emotionScanHistory', JSON.stringify(newHistory));

    setTotalScans(totalScans + 1);
    setStreak(streak + 1);
    localStorage.setItem('emotionScanStreak', (streak + 1).toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔮 Voyage Émotionnel
          </motion.h1>
          <p className="text-muted-foreground">Découvrez votre état émotionnel en temps réel</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center border-primary/20">
            <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">{totalScans}</div>
            <div className="text-sm text-muted-foreground">Scans totaux</div>
          </Card>
          <Card className="p-4 text-center border-secondary/20">
            <Zap className="w-6 h-6 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold text-foreground">{streak}</div>
            <div className="text-sm text-muted-foreground">Série</div>
          </Card>
          <Card className="p-4 text-center border-accent/20">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold text-foreground">
              {scanHistory.length > 0 ? scanHistory[0].confidence : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Précision</div>
          </Card>
        </div>

        {/* Scan Area */}
        <Card className="p-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!isScanning && !scanResult && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-32 h-32 mx-auto"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-primary" />
                  </div>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Prêt pour votre scan ?</h2>
                  <p className="text-muted-foreground mb-6">
                    Laissez notre IA analyser votre état émotionnel
                  </p>
                  <Button size="lg" onClick={startScan} className="gap-2">
                    <Sparkles className="w-5 h-5" />
                    Lancer le scan
                  </Button>
                </div>
              </motion.div>
            )}

            {isScanning && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-32 h-32 mx-auto mb-6"
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse flex items-center justify-center">
                      <Brain className="w-16 h-16 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {currentStage < SCAN_STAGES.length
                      ? SCAN_STAGES[currentStage].name
                      : 'Finalisation'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {currentStage < SCAN_STAGES.length
                      ? SCAN_STAGES[currentStage].description
                      : 'Analyse terminée'}
                  </p>
                </div>
                <Progress value={scanProgress} className="h-2" />
                <div className="text-center text-sm text-muted-foreground">
                  {Math.round(scanProgress)}%
                </div>
              </motion.div>
            )}

            {scanResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-32 h-32 mx-auto mb-6"
                    style={{ backgroundColor: scanResult.color }}
                  >
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <Heart className="w-16 h-16 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-2 capitalize text-foreground">
                    {scanResult.emotion}
                  </h3>
                  <div className="text-sm text-muted-foreground mb-4">
                    Confiance: {scanResult.confidence}%
                  </div>
                </div>

                <Card className="p-4 bg-secondary/5 border-secondary/20">
                  <h4 className="font-semibold mb-2 text-foreground">💡 Insight</h4>
                  <p className="text-sm text-muted-foreground">{scanResult.insight}</p>
                </Card>

                <Card className="p-4 bg-primary/5 border-primary/20">
                  <h4 className="font-semibold mb-2 text-foreground">🎯 Recommandation</h4>
                  <p className="text-sm text-muted-foreground">{scanResult.recommendation}</p>
                </Card>

                <Button onClick={startScan} variant="outline" className="w-full">
                  Nouveau scan
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </Card>

        {/* History */}
        {scanHistory.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 text-foreground">📊 Historique récent</h3>
            <div className="space-y-2">
              {scanHistory.slice(0, 5).map((scan, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: scan.color }}
                  />
                  <div className="flex-1">
                    <div className="font-medium capitalize text-foreground">{scan.emotion}</div>
                    <div className="text-sm text-muted-foreground">{scan.confidence}% confiance</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
