/**
 * BreathBiofeedback - Biofeedback temps réel pour la respiration
 * Affiche les données physiologiques en direct pendant l'exercice
 */

import React, { useState, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, Activity, Wind, Brain, TrendingUp, 
  TrendingDown, Minus, AlertCircle, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BiofeedbackData {
  heartRate: number;
  hrv: number; // Heart Rate Variability
  respiratoryRate: number;
  coherenceScore: number;
  stressLevel: number;
}

interface BreathBiofeedbackProps {
  isActive?: boolean;
  onDataUpdate?: (data: BiofeedbackData) => void;
}

const BreathBiofeedback = memo(({ isActive = false, onDataUpdate }: BreathBiofeedbackProps) => {
  const [data, setData] = useState<BiofeedbackData>({
    heartRate: 72,
    hrv: 45,
    respiratoryRate: 12,
    coherenceScore: 65,
    stressLevel: 35
  });

  const [history, setHistory] = useState<number[]>([]);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setData(prev => {
        // Simulation de données en temps réel
        const newHeartRate = Math.max(55, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4));
        const newHrv = Math.max(20, Math.min(80, prev.hrv + (Math.random() - 0.5) * 5));
        const newRespiratoryRate = Math.max(8, Math.min(20, prev.respiratoryRate + (Math.random() - 0.5) * 2));
        const newCoherence = Math.max(0, Math.min(100, prev.coherenceScore + (Math.random() - 0.4) * 8));
        const newStress = Math.max(0, Math.min(100, prev.stressLevel + (Math.random() - 0.6) * 6));

        const newData = {
          heartRate: Math.round(newHeartRate),
          hrv: Math.round(newHrv),
          respiratoryRate: Math.round(newRespiratoryRate),
          coherenceScore: Math.round(newCoherence),
          stressLevel: Math.round(newStress)
        };

        onDataUpdate?.(newData);
        return newData;
      });

      // Mettre à jour l'historique pour le trend
      setHistory(prev => {
        const newHistory = [...prev, data.coherenceScore].slice(-10);
        
        if (newHistory.length >= 3) {
          const recent = newHistory.slice(-3);
          const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
          const first = recent[0];
          if (avg > first + 5) setTrend('up');
          else if (avg < first - 5) setTrend('down');
          else setTrend('stable');
        }
        
        return newHistory;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, data.coherenceScore, onDataUpdate]);

  const getCoherenceStatus = (score: number) => {
    if (score >= 70) return { label: 'Excellent', color: 'text-green-500', icon: CheckCircle };
    if (score >= 50) return { label: 'Bon', color: 'text-blue-500', icon: Activity };
    if (score >= 30) return { label: 'Moyen', color: 'text-yellow-500', icon: AlertCircle };
    return { label: 'Faible', color: 'text-red-500', icon: AlertCircle };
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const coherenceStatus = getCoherenceStatus(data.coherenceScore);
  const CoherenceIcon = coherenceStatus.icon;

  return (
    <Card className={!isActive ? 'opacity-60' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Biofeedback
          </div>
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'En direct' : 'En pause'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score de cohérence principal */}
        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CoherenceIcon className={`h-5 w-5 ${coherenceStatus.color}`} />
            <span className={`font-medium ${coherenceStatus.color}`}>
              {coherenceStatus.label}
            </span>
            {getTrendIcon()}
          </div>
          <motion.div
            key={data.coherenceScore}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold"
          >
            {data.coherenceScore}%
          </motion.div>
          <p className="text-sm text-muted-foreground mt-1">Score de cohérence</p>
          <Progress value={data.coherenceScore} className="mt-3" aria-label="Cohérence cardiaque" />
        </div>

        {/* Métriques détaillées */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Fréquence cardiaque</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={data.heartRate}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold"
              >
                {data.heartRate} <span className="text-sm font-normal text-muted-foreground">bpm</span>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Variabilité (HRV)</span>
            </div>
            <motion.div
              key={data.hrv}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
            >
              {data.hrv} <span className="text-sm font-normal text-muted-foreground">ms</span>
            </motion.div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Wind className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Respiration</span>
            </div>
            <motion.div
              key={data.respiratoryRate}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
            >
              {data.respiratoryRate} <span className="text-sm font-normal text-muted-foreground">/min</span>
            </motion.div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Niveau stress</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                key={data.stressLevel}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold"
              >
                {data.stressLevel}%
              </motion.div>
              {data.stressLevel < 30 && (
                <Badge variant="outline" className="bg-green-500/10 text-green-600">Bas</Badge>
              )}
              {data.stressLevel >= 30 && data.stressLevel < 60 && (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Modéré</Badge>
              )}
              {data.stressLevel >= 60 && (
                <Badge variant="outline" className="bg-red-500/10 text-red-600">Élevé</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Graphique simplifié de l'historique */}
        <div className="h-16 flex items-end gap-1">
          {history.map((value, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${value}%` }}
              className="flex-1 bg-primary/60 rounded-t"
              style={{ minHeight: '4px' }}
            />
          ))}
          {history.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Démarrez l'exercice pour voir l'historique
            </div>
          )}
        </div>

        {/* Conseils dynamiques */}
        {isActive && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            {data.coherenceScore >= 70 ? (
              <p className="text-sm text-green-600 dark:text-green-400">
                🎯 Excellent ! Maintenez ce rythme respiratoire régulier.
              </p>
            ) : data.coherenceScore >= 50 ? (
              <p className="text-sm text-blue-600 dark:text-blue-400">
                ✨ Bien ! Essayez de ralentir légèrement votre respiration.
              </p>
            ) : (
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                💡 Concentrez-vous sur des expirations plus longues que les inspirations.
              </p>
            )}
          </div>
        )}

        {!isActive && (
          <div className="text-center text-muted-foreground text-sm">
            Démarrez un exercice de respiration pour activer le biofeedback
          </div>
        )}
      </CardContent>
    </Card>
  );
});

BreathBiofeedback.displayName = 'BreathBiofeedback';

export default BreathBiofeedback;
