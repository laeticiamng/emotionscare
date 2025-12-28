// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BiometricData } from '@/types/emotion';
import { Heart, Waves, Eye, Activity, Brain, Zap } from 'lucide-react';

interface BiometricDisplayProps {
  biometrics: BiometricData;
}

const BiometricDisplay: React.FC<BiometricDisplayProps> = ({ biometrics }) => {
  const getHeartRateStatus = (hr: number) => {
    if (hr < 60) return { status: 'Bradycardie', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (hr > 100) return { status: 'Tachycardie', color: 'text-red-600', bg: 'bg-red-100' };
    return { status: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const getBreathingStatus = (br: number) => {
    if (br < 12) return { status: 'Lente', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (br > 20) return { status: 'Rapide', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { status: 'Normale', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const heartRate = biometrics.heartRate || 0;
  const breathingRate = biometrics.breathingRate || 0;
  const skinConductance = biometrics.skinConductance || 0;
  
  const hrStatus = getHeartRateStatus(heartRate);
  const brStatus = getBreathingStatus(breathingRate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Données Biométriques
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rythme cardiaque */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="font-medium text-sm">Rythme Cardiaque</span>
            </div>
            <Badge className={`${hrStatus.bg} ${hrStatus.color} text-xs`}>
              {hrStatus.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <motion.div
              className="flex items-center gap-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 60/heartRate, repeat: Infinity }}
            >
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-2xl font-bold">{Math.round(heartRate)}</span>
              <span className="text-sm text-muted-foreground">BPM</span>
            </motion.div>
            <div className="flex-1">
              <Progress value={Math.min((heartRate / 120) * 100, 100)} className="h-2" />
            </div>
          </div>
        </div>

        {/* Respiration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-sm">Respiration</span>
            </div>
            <Badge className={`${brStatus.bg} ${brStatus.color} text-xs`}>
              {brStatus.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <motion.div
              className="flex items-center gap-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 60/breathingRate, repeat: Infinity }}
            >
              <Waves className="w-4 h-4 text-blue-500" />
              <span className="text-2xl font-bold">{Math.round(breathingRate)}</span>
              <span className="text-sm text-muted-foreground">RPM</span>
            </motion.div>
            <div className="flex-1">
              <Progress value={(breathingRate / 25) * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Conductance cutanée */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="font-medium text-sm">Stress Physiologique</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{Math.round(skinConductance)}</span>
              <span className="text-sm text-muted-foreground">μS</span>
            </div>
            <div className="flex-1">
              <Progress 
                value={skinConductance} 
                className="h-2"
              />
            </div>
          </div>
        </div>

        {/* Métriques oculaires */}
        {biometrics.eyeTracking && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-500" />
              <span className="font-medium text-sm">Suivi Oculaire</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-bold">{Math.round(biometrics.eyeTracking.blinkRate)}</div>
                <div className="text-xs text-muted-foreground">Clignements/min</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-bold">{biometrics.eyeTracking.pupilDilation.toFixed(1)}mm</div>
                <div className="text-xs text-muted-foreground">Dilatation pupille</div>
              </div>
            </div>
          </div>
        )}

        {/* Métriques faciales */}
        {biometrics.faceMetrics && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-500" />
              <span className="font-medium text-sm">Analyse Faciale</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Intensité d'expression</span>
                <span className="text-sm font-medium">
                  {Math.round(biometrics.faceMetrics.expressionIntensity * 100)}%
                </span>
              </div>
              <Progress value={biometrics.faceMetrics.expressionIntensity * 100} className="h-2" />
              
              {biometrics.faceMetrics.microExpressions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {biometrics.faceMetrics.microExpressions.map((expr, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {expr}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Indicateur de qualité globale */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">Qualité des données</span>
            <Badge variant="secondary">
              {heartRate > 0 && breathingRate > 0 ? 'Excellente' : 
               heartRate > 0 || breathingRate > 0 ? 'Partielle' : 'En attente'}
            </Badge>
          </div>
          <Progress 
            value={
              (heartRate > 0 ? 33 : 0) + 
              (breathingRate > 0 ? 33 : 0) + 
              (skinConductance > 0 ? 34 : 0)
            } 
            className="h-2" 
          />
          <p className="text-xs text-muted-foreground mt-1">
            {heartRate > 0 && breathingRate > 0 && skinConductance > 0
              ? 'Toutes les métriques sont disponibles'
              : 'Connectez un appareil pour plus de données'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiometricDisplay;