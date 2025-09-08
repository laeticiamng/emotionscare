/**
 * 🎯 SCANNER D'ÉMOTIONS PREMIUM EMOTIONSCARE
 * Composant de scan émotionnel multi-sources avec IA avancée
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Mic, MicOff, Scan, Brain, Eye, 
  Loader2, CheckCircle, AlertCircle, Settings, 
  Zap, Target, Heart, TrendingUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmotionsCarePlatform } from '@/hooks/useEmotionsCarePlatform';
import { UnifiedEmotionAnalysis, EmotionLabel, EMOTION_LABELS } from '@/types/unified-emotions';

type ScanSource = 'camera' | 'microphone' | 'text' | 'multimodal';
type ScanState = 'idle' | 'preparing' | 'scanning' | 'analyzing' | 'complete' | 'error';

interface EmotionScannerPremiumProps {
  userId: string;
  onAnalysisComplete?: (analysis: UnifiedEmotionAnalysis) => void;
  onError?: (error: string) => void;
  defaultSource?: ScanSource;
  showAdvancedMode?: boolean;
  className?: string;
}

export const EmotionScannerPremium: React.FC<EmotionScannerPremiumProps> = ({
  userId,
  onAnalysisComplete,
  onError,
  defaultSource = 'camera',
  showAdvancedMode = true,
  className = ""
}) => {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [selectedSource, setSelectedSource] = useState<ScanSource>(defaultSource);
  const [progress, setProgress] = useState(0);
  const [currentAnalysis, setCurrentAnalysis] = useState<UnifiedEmotionAnalysis | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const { analyzeEmotion, isLoading } = useEmotionsCarePlatform(userId);

  // Nettoyage des ressources
  useEffect(() => {
    return () => {
      stopMediaStream();
    };
  }, []);

  // Arrêt du flux média
  const stopMediaStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Configuration de la caméra
  const setupCamera = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur accès caméra:', error);
      onError?.('Impossible d\'accéder à la caméra');
      return false;
    }
  }, [onError]);

  // Configuration du microphone
  const setupMicrophone = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      streamRef.current = stream;
      return true;
    } catch (error) {
      console.error('Erreur accès microphone:', error);
      onError?.('Impossible d\'accéder au microphone');
      return false;
    }
  }, [onError]);

  // Capture d'image de la caméra
  const captureImage = useCallback((): Blob | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.9);
    }) as any;
  }, []);

  // Démarrage de l'enregistrement audio
  const startAudioRecording = useCallback(() => {
    if (!mediaRecorderRef.current) return;
    
    recordedChunksRef.current = [];
    mediaRecorderRef.current.start();
    setIsRecording(true);
  }, []);

  // Arrêt de l'enregistrement audio
  const stopAudioRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        resolve(blob);
      };

      mediaRecorderRef.current.stop();
      setIsRecording(false);
    });
  }, []);

  // Compte à rebours pour le scan
  const startCountdown = useCallback(() => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Analyse émotionnelle selon la source
  const performAnalysis = useCallback(async () => {
    setScanState('analyzing');
    setProgress(50);

    try {
      let analysisData: { text?: string; audioBlob?: Blob; imageBlob?: Blob } = {};

      switch (selectedSource) {
        case 'camera':
          const imageBlob = await captureImage();
          if (imageBlob) {
            analysisData.imageBlob = imageBlob;
          }
          break;

        case 'microphone':
          const audioBlob = await stopAudioRecording();
          if (audioBlob) {
            analysisData.audioBlob = audioBlob;
          }
          break;

        case 'text':
          if (textInput.trim()) {
            analysisData.text = textInput.trim();
          }
          break;

        case 'multimodal':
          const [multiImageBlob, multiAudioBlob] = await Promise.all([
            captureImage(),
            stopAudioRecording()
          ]);
          if (multiImageBlob) analysisData.imageBlob = multiImageBlob;
          if (multiAudioBlob) analysisData.audioBlob = multiAudioBlob;
          if (textInput.trim()) analysisData.text = textInput.trim();
          break;
      }

      setProgress(75);

      const analysis = await analyzeEmotion(analysisData);
      
      if (analysis) {
        setCurrentAnalysis(analysis);
        setScanState('complete');
        setProgress(100);
        onAnalysisComplete?.(analysis);
      } else {
        throw new Error('Analyse échouée');
      }

    } catch (error) {
      console.error('Erreur analyse:', error);
      setScanState('error');
      onError?.(error instanceof Error ? error.message : 'Erreur inconnue');
    }
  }, [selectedSource, captureImage, stopAudioRecording, textInput, analyzeEmotion, onAnalysisComplete, onError]);

  // Démarrage du scan
  const startScan = useCallback(async () => {
    setScanState('preparing');
    setProgress(0);
    setCurrentAnalysis(null);

    try {
      // Configuration selon la source
      switch (selectedSource) {
        case 'camera':
          if (!(await setupCamera())) return;
          break;
        case 'microphone':
          if (!(await setupMicrophone())) return;
          break;
        case 'multimodal':
          if (!(await setupCamera()) || !(await setupMicrophone())) return;
          break;
      }

      setScanState('scanning');
      setProgress(25);

      // Compte à rebours avant capture
      if (selectedSource !== 'text') {
        startCountdown();
        
        // Attendre la fin du countdown
        setTimeout(() => {
          if (selectedSource === 'microphone' || selectedSource === 'multimodal') {
            startAudioRecording();
            // Enregistrer pendant 3 secondes
            setTimeout(() => {
              performAnalysis();
            }, 3000);
          } else {
            performAnalysis();
          }
        }, 3000);
      } else {
        performAnalysis();
      }

    } catch (error) {
      setScanState('error');
      onError?.(error instanceof Error ? error.message : 'Erreur de configuration');
    }
  }, [selectedSource, setupCamera, setupMicrophone, startCountdown, startAudioRecording, performAnalysis, onError]);

  // Réinitialisation du scanner
  const resetScanner = useCallback(() => {
    stopMediaStream();
    setScanState('idle');
    setProgress(0);
    setCurrentAnalysis(null);
    setTextInput('');
    setCountdown(0);
    setIsRecording(false);
  }, [stopMediaStream]);

  // Rendu des résultats d'analyse
  const renderAnalysisResults = () => {
    if (!currentAnalysis) return null;

    const emotionColor = EMOTION_LABELS[currentAnalysis.primaryEmotion]?.color || '#6b7280';
    const confidencePercent = Math.round(currentAnalysis.overallConfidence * 100);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="text-center">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
            style={{ backgroundColor: emotionColor }}
          >
            {currentAnalysis.primaryEmotion.slice(0, 2).toUpperCase()}
          </div>
          
          <h3 className="text-xl font-semibold capitalize">
            {currentAnalysis.primaryEmotion}
          </h3>
          
          <p className="text-muted-foreground">
            Confiance: {confidencePercent}%
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Valence:</span>
              <span>{Math.round(currentAnalysis.emotionVector.valence * 100)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Activation:</span>
              <span>{Math.round(currentAnalysis.emotionVector.arousal * 100)}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Dominance:</span>
              <span>{Math.round(currentAnalysis.emotionVector.dominance * 100)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Stabilité:</span>
              <span>{Math.round(currentAnalysis.emotionVector.stability * 100)}%</span>
            </div>
          </div>
        </div>

        {currentAnalysis.emotions.length > 1 && (
          <div className="space-y-2">
            <h4 className="font-medium">Émotions détectées:</h4>
            <div className="flex flex-wrap gap-2">
              {currentAnalysis.emotions.slice(0, 5).map((emotion, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  style={{
                    backgroundColor: `${EMOTION_LABELS[emotion.emotion as EmotionLabel]?.color}20`,
                    borderColor: EMOTION_LABELS[emotion.emotion as EmotionLabel]?.color
                  }}
                >
                  {emotion.emotion} ({Math.round(emotion.confidence * 100)}%)
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button onClick={resetScanner} variant="outline" className="flex-1">
            Nouveau scan
          </Button>
          <Button 
            onClick={() => onAnalysisComplete?.(currentAnalysis)}
            className="flex-1"
          >
            Continuer
          </Button>
        </div>
      </motion.div>
    );
  };

  // Rendu de l'interface de scan
  const renderScanInterface = () => {
    switch (selectedSource) {
      case 'camera':
        return (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 bg-muted rounded-lg object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {countdown > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-white text-6xl font-bold"
                >
                  {countdown}
                </motion.div>
              </div>
            )}
            
            {scanState === 'scanning' && countdown === 0 && (
              <div className="absolute inset-0 border-4 border-primary rounded-lg animate-pulse" />
            )}
          </div>
        );

      case 'microphone':
        return (
          <div className="h-64 flex flex-col items-center justify-center bg-muted rounded-lg">
            <motion.div
              animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Mic className={`h-16 w-16 ${isRecording ? 'text-red-500' : 'text-muted-foreground'}`} />
            </motion.div>
            
            <p className="mt-4 text-center text-muted-foreground">
              {isRecording ? 'Enregistrement en cours...' : 'Prêt pour l\'enregistrement vocal'}
            </p>
            
            {countdown > 0 && (
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-bold mt-4"
              >
                {countdown}
              </motion.div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Décrivez comment vous vous sentez ou écrivez un texte à analyser..."
              className="w-full h-32 p-4 border rounded-lg resize-none bg-background"
              maxLength={500}
            />
            <div className="text-right text-sm text-muted-foreground">
              {textInput.length}/500 caractères
            </div>
          </div>
        );

      case 'multimodal':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-32 bg-muted rounded-lg object-cover"
                />
              </div>
              <div className="h-32 flex items-center justify-center bg-muted rounded-lg">
                <motion.div
                  animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Mic className={`h-8 w-8 ${isRecording ? 'text-red-500' : 'text-muted-foreground'}`} />
                </motion.div>
              </div>
            </div>
            
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Texte optionnel..."
              className="w-full h-20 p-3 border rounded-lg resize-none bg-background text-sm"
              maxLength={200}
            />
            
            <canvas ref={canvasRef} className="hidden" />
            
            {countdown > 0 && (
              <div className="text-center">
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold"
                >
                  {countdown}
                </motion.div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Scanner d'Émotions</h2>
              <p className="text-sm text-muted-foreground">
                Analyse émotionnelle IA avancée
              </p>
            </div>
          </div>
          
          {showAdvancedMode && (
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Sélection de source */}
        {scanState === 'idle' && (
          <Tabs value={selectedSource} onValueChange={(value) => setSelectedSource(value as ScanSource)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="camera" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Caméra</span>
              </TabsTrigger>
              <TabsTrigger value="microphone" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Audio</span>
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Texte</span>
              </TabsTrigger>
              <TabsTrigger value="multimodal" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Multi</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Interface de scan */}
        {scanState !== 'complete' && (
          <div className="space-y-4">
            {renderScanInterface()}
            
            {/* Progrès */}
            {scanState !== 'idle' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">{scanState}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Contrôles */}
            <div className="flex gap-3">
              {scanState === 'idle' && (
                <Button 
                  onClick={startScan} 
                  disabled={isLoading || (selectedSource === 'text' && !textInput.trim())}
                  className="flex-1"
                >
                  <Scan className="h-4 w-4 mr-2" />
                  Démarrer le scan
                </Button>
              )}
              
              {scanState !== 'idle' && scanState !== 'complete' && (
                <Button 
                  onClick={resetScanner}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Résultats */}
        {scanState === 'complete' && renderAnalysisResults()}

        {/* État d'erreur */}
        {scanState === 'error' && (
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="font-semibold">Erreur de scan</h3>
              <p className="text-sm text-muted-foreground">
                Une erreur s'est produite lors de l'analyse
              </p>
            </div>
            <Button onClick={resetScanner}>
              Réessayer
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};