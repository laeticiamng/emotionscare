import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Focus, Activity, BarChart3, Clock, AlertCircle, RefreshCw, Target } from 'lucide-react';

interface GazePoint {
  x: number;
  y: number;
  timestamp: number;
  duration: number;
}

interface FocusZone {
  id: string;
  name: string;
  timeSpent: number;
  visits: number;
  avgDuration: number;
}

interface EyeTrackingStats {
  totalSessionTime: number;
  fixationCount: number;
  avgFixationDuration: number;
  saccadeCount: number;
  blinkRate: number;
  focusScore: number;
  fatigueLevel: number;
}

const VREyeTracking: React.FC = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [gazeHistory, setGazeHistory] = useState<GazePoint[]>([]);
  const [focusZones, setFocusZones] = useState<FocusZone[]>([]);
  const [stats, setStats] = useState<EyeTrackingStats>({
    totalSessionTime: 0,
    fixationCount: 0,
    avgFixationDuration: 0,
    saccadeCount: 0,
    blinkRate: 15,
    focusScore: 0,
    fatigueLevel: 0
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  // Simuler le tracking oculaire (en production, utiliser WebXR Eye Tracking API)
  const simulateEyeTracking = useCallback(() => {
    if (!isTracking || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simuler un point de regard avec mouvement naturel
    const time = Date.now();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Mouvement de balayage naturel avec micro-saccades
    const x = centerX + Math.sin(time / 1000) * 80 + Math.random() * 10 - 5;
    const y = centerY + Math.cos(time / 1500) * 60 + Math.random() * 10 - 5;

    // Dessiner le point de regard
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#8b5cf6';
    ctx.fill();

    // Dessiner le heatmap léger des zones de focus
    gazeHistory.slice(-50).forEach((point, index) => {
      const alpha = (index / 50) * 0.2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(234, 179, 8, ${alpha})`;
      ctx.fill();
    });

    // Ajouter au historique
    const newPoint: GazePoint = {
      x,
      y,
      timestamp: time,
      duration: 16
    };
    setGazeHistory(prev => [...prev.slice(-200), newPoint]);

    // Mettre à jour les stats
    const elapsed = (time - startTimeRef.current) / 1000;
    setStats(prev => ({
      ...prev,
      totalSessionTime: elapsed,
      fixationCount: Math.floor(elapsed / 0.3),
      avgFixationDuration: 250 + Math.random() * 100,
      saccadeCount: Math.floor(elapsed / 0.5),
      focusScore: Math.min(100, 60 + Math.random() * 30),
      fatigueLevel: Math.min(100, (elapsed / 60) * 10 + Math.random() * 5)
    }));

    animationRef.current = requestAnimationFrame(simulateEyeTracking);
  }, [isTracking, gazeHistory]);

  useEffect(() => {
    if (isTracking) {
      startTimeRef.current = Date.now();
      simulateEyeTracking();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTracking, simulateEyeTracking]);

  // Simulation des zones de focus
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        setFocusZones([
          { id: 'center', name: 'Centre de l\'écran', timeSpent: 45, visits: 12, avgDuration: 3.75 },
          { id: 'nature', name: 'Éléments naturels', timeSpent: 30, visits: 8, avgDuration: 3.75 },
          { id: 'horizon', name: 'Ligne d\'horizon', timeSpent: 15, visits: 6, avgDuration: 2.5 },
          { id: 'ui', name: 'Interface utilisateur', timeSpent: 10, visits: 4, avgDuration: 2.5 }
        ]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const startCalibration = () => {
    setCalibrationStep(1);
    const steps = 9; // 9 points de calibration
    
    const runCalibration = (step: number) => {
      if (step > steps) {
        setIsCalibrated(true);
        setCalibrationStep(0);
        return;
      }
      setCalibrationStep(step);
      setTimeout(() => runCalibration(step + 1), 1500);
    };
    
    runCalibration(1);
  };

  const toggleTracking = () => {
    if (!isCalibrated && !isTracking) {
      startCalibration();
    } else {
      setIsTracking(!isTracking);
      if (!isTracking) {
        setGazeHistory([]);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFatigueColor = (level: number) => {
    if (level < 30) return 'text-green-500';
    if (level < 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Calibration en cours */}
      {calibrationStep > 0 && (
        <Card className="bg-background/95 backdrop-blur">
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
            <h3 className="text-xl font-semibold mb-2">Calibration en cours</h3>
            <p className="text-muted-foreground mb-4">
              Regardez le point qui apparaît à l'écran
            </p>
            <Progress value={(calibrationStep / 9) * 100} className="w-64 mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">
              Point {calibrationStep} / 9
            </p>
          </CardContent>
        </Card>
      )}

      {/* Visualisation du tracking */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Eye Tracking VR
          </CardTitle>
          <div className="flex items-center gap-2">
            {isCalibrated && (
              <Badge variant="outline" className="text-green-500 border-green-500">
                Calibré
              </Badge>
            )}
            <Button
              variant={isTracking ? 'destructive' : 'default'}
              onClick={toggleTracking}
              disabled={calibrationStep > 0}
            >
              {isTracking ? 'Arrêter' : isCalibrated ? 'Démarrer' : 'Calibrer'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative bg-muted/50 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              className="w-full h-auto"
            />
            {!isTracking && !calibrationStep && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center">
                  <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {isCalibrated 
                      ? 'Cliquez sur Démarrer pour commencer le tracking'
                      : 'Calibrez d\'abord le système de suivi oculaire'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{formatTime(stats.totalSessionTime)}</p>
            <p className="text-xs text-muted-foreground">Temps de session</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Focus className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.fixationCount}</p>
            <p className="text-xs text-muted-foreground">Fixations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.focusScore.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Score de focus</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className={`h-5 w-5 mx-auto mb-2 ${getFatigueColor(stats.fatigueLevel)}`} />
            <p className={`text-2xl font-bold ${getFatigueColor(stats.fatigueLevel)}`}>
              {stats.fatigueLevel.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">Fatigue oculaire</p>
          </CardContent>
        </Card>
      </div>

      {/* Zones de focus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Zones de Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="distribution">
            <TabsList className="mb-4">
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
            </TabsList>
            
            <TabsContent value="distribution" className="space-y-3">
              {focusZones.map((zone) => (
                <div key={zone.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{zone.name}</span>
                    <span className="text-muted-foreground">{zone.timeSpent}%</span>
                  </div>
                  <Progress value={zone.timeSpent} className="h-2" />
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="details">
              <div className="space-y-3">
                {focusZones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{zone.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {zone.visits} visites
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{zone.avgDuration.toFixed(1)}s</p>
                      <p className="text-sm text-muted-foreground">durée moy.</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Recalibrer</p>
              <p className="text-sm text-muted-foreground">
                Si le tracking semble imprécis
              </p>
            </div>
            <Button
              variant="outline"
              onClick={startCalibration}
              disabled={isTracking || calibrationStep > 0}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recalibrer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VREyeTracking;
