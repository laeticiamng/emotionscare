import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Mic, Brain, Activity, Zap, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmotionalState {
  primary: string;
  confidence: number;
  secondary: string[];
  intensity: number;
  valence: number;
  arousal: number;
  timestamp: string;
}

interface CalibrationData {
  baseline: Record<string, number>;
  personalFactors: Record<string, number>;
  environmentalFactors: Record<string, number>;
  isCalibrated: boolean;
}

const AdvancedEmotionalScan: React.FC = () => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'face' | 'voice' | 'combined'>('face');
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null);
  const [calibration, setCalibration] = useState<CalibrationData>({
    baseline: {},
    personalFactors: {},
    environmentalFactors: {},
    isCalibrated: false
  });
  const [scanProgress, setScanProgress] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const initializeCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      // Camera access error
      toast({
        title: "Erreur caméra",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive"
      });
    }
  }, [toast]);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return null;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const analyzeEmotions = useCallback(async (imageData: string): Promise<EmotionalState> => {
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-emotion-analyze', {
        body: {
          image: imageData.split(',')[1], // Remove data:image/jpeg;base64, prefix
          mode: scanMode,
          calibration: calibration.isCalibrated ? calibration : null
        }
      });

      if (error) throw error;

      return {
        primary: data.primary_emotion,
        confidence: data.confidence,
        secondary: data.secondary_emotions || [],
        intensity: data.intensity,
        valence: data.valence,
        arousal: data.arousal,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Emotion analysis error
      throw error;
    }
  }, [scanMode, calibration]);

  const performCalibration = useCallback(async () => {
    setIsCalibrating(true);
    
    try {
      const calibrationFrames: string[] = [];
      const steps = ['neutral', 'happy', 'sad', 'surprised', 'relaxed'];
      
      for (let i = 0; i < steps.length; i++) {
        toast({
          title: `Calibrage ${i + 1}/${steps.length}`,
          description: `Montrez une expression ${steps[i]}`,
        });
        
        // Wait 3 seconds for user to prepare
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Capture frame
        const frame = captureFrame();
        if (frame) calibrationFrames.push(frame);
        
        setScanProgress((i + 1) / steps.length * 100);
      }

      // Send calibration data to edge function
      const { data, error } = await supabase.functions.invoke('emotion-calibration', {
        body: {
          calibrationFrames,
          userProfile: {
            age: 25, // This would come from user profile
            gender: 'unknown',
            culturalBackground: 'unknown'
          }
        }
      });

      if (error) throw error;

      setCalibration({
        baseline: data.baseline,
        personalFactors: data.personalFactors,
        environmentalFactors: data.environmentalFactors,
        isCalibrated: true
      });

      toast({
        title: "Calibrage terminé",
        description: "Votre profil émotionnel a été calibré avec succès",
      });

    } catch (error) {
      // Calibration error
      toast({
        title: "Erreur de calibrage",
        description: "Impossible de calibrer le système",
        variant: "destructive"
      });
    } finally {
      setIsCalibrating(false);
      setScanProgress(0);
    }
  }, [captureFrame, toast]);

  const startScan = useCallback(async () => {
    if (!calibration.isCalibrated) {
      toast({
        title: "Calibrage requis",
        description: "Veuillez d'abord calibrer le système",
        variant: "destructive"
      });
      return;
    }

    await initializeCamera();
    setIsScanning(true);
    setScanProgress(0);

    const scanInterval = setInterval(async () => {
      const frame = captureFrame();
      if (frame) {
        try {
          const emotions = await analyzeEmotions(frame);
          setEmotionalState(emotions);
          setScanProgress(prev => Math.min(prev + 10, 100));
        } catch (error) {
          // Scan frame error
        }
      }
    }, 500);

    // Stop after 10 seconds
    setTimeout(() => {
      clearInterval(scanInterval);
      setIsScanning(false);
      setScanProgress(100);
    }, 10000);
  }, [calibration.isCalibrated, initializeCamera, captureFrame, analyzeEmotions, toast]);

  const stopScan = useCallback(() => {
    setIsScanning(false);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  }, []);

  useEffect(() => {
    return () => {
      stopScan();
    };
  }, [stopScan]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Scan Émotionnel Avancé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={scanMode} onValueChange={(value) => setScanMode(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="face" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Facial
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Vocal
              </TabsTrigger>
              <TabsTrigger value="combined" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Combiné
              </TabsTrigger>
            </TabsList>

            <TabsContent value="face" className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full max-w-md mx-auto rounded-lg border"
                  autoPlay
                  muted
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex flex-col space-y-4">
                {!calibration.isCalibrated && (
                  <Button
                    onClick={performCalibration}
                    disabled={isCalibrating}
                    className="flex items-center gap-2"
                  >
                    <Target className="h-4 w-4" />
                    {isCalibrating ? 'Calibrage en cours...' : 'Calibrer le système'}
                  </Button>
                )}

                {calibration.isCalibrated && (
                  <div className="flex gap-4">
                    <Button
                      onClick={startScan}
                      disabled={isScanning}
                      className="flex items-center gap-2"
                    >
                      <Activity className="h-4 w-4" />
                      {isScanning ? 'Scan en cours...' : 'Démarrer le scan'}
                    </Button>

                    {isScanning && (
                      <Button onClick={stopScan} variant="outline">
                        Arrêter
                      </Button>
                    )}
                  </div>
                )}

                {(isScanning || isCalibrating) && (
                  <Progress value={scanProgress} className="w-full" />
                )}
              </div>
            </TabsContent>

            <TabsContent value="voice" className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
                <Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Analyse vocale disponible bientôt</p>
              </div>
            </TabsContent>

            <TabsContent value="combined" className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
                <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Analyse multi-modale disponible bientôt</p>
              </div>
            </TabsContent>
          </Tabs>

          {emotionalState && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Résultats du Scan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Émotion principale:</span>
                  <Badge variant="default" className="text-lg">
                    {emotionalState.primary}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Confiance:</span>
                  <span className="text-lg font-bold text-primary">
                    {Math.round(emotionalState.confidence * 100)}%
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="font-medium">Intensité émotionnelle:</span>
                  <Progress value={emotionalState.intensity * 100} className="w-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Valence:</span>
                    <Progress value={(emotionalState.valence + 1) * 50} className="w-full mt-1" />
                  </div>
                  <div>
                    <span className="font-medium">Excitation:</span>
                    <Progress value={emotionalState.arousal * 100} className="w-full mt-1" />
                  </div>
                </div>

                {emotionalState.secondary.length > 0 && (
                  <div>
                    <span className="font-medium">Émotions secondaires:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {emotionalState.secondary.map((emotion, index) => (
                        <Badge key={index} variant="secondary">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedEmotionalScan;