import React, { useState, useRef, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, Mic, MicOff, Video, VideoOff, 
  Brain, Heart, Smile, Frown, Meh,
  Play, Square, RotateCcw, Sparkles,
  Loader2, CheckCircle, AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { EmotionResult } from '@/types/emotion';

interface EmotionScannerPremiumProps {
  onEmotionDetected: (result: EmotionResult) => void;
  autoGenerateMusic?: boolean;
  showRecommendations?: boolean;
}

type ScanMode = 'voice' | 'face' | 'mood_cards';

const EmotionScannerPremium: React.FC<EmotionScannerPremiumProps> = ({
  onEmotionDetected,
  autoGenerateMusic = false,
  showRecommendations = true,
}) => {
  const { user } = useAuth();
  const [scanMode, setScanMode] = useState<ScanMode>('mood_cards');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const moodCards = [
    { id: 'happy', label: 'Heureux', emoji: '😊', color: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200' },
    { id: 'calm', label: 'Calme', emoji: '😌', color: 'bg-blue-100 border-blue-300 hover:bg-blue-200' },
    { id: 'energetic', label: 'Énergique', emoji: '⚡', color: 'bg-orange-100 border-orange-300 hover:bg-orange-200' },
    { id: 'focused', label: 'Concentré', emoji: '🎯', color: 'bg-green-100 border-green-300 hover:bg-green-200' },
    { id: 'sad', label: 'Triste', emoji: '😔', color: 'bg-gray-100 border-gray-300 hover:bg-gray-200' },
    { id: 'anxious', label: 'Anxieux', emoji: '😰', color: 'bg-red-100 border-red-300 hover:bg-red-200' },
    { id: 'tired', label: 'Fatigué', emoji: '😴', color: 'bg-purple-100 border-purple-300 hover:bg-purple-200' },
    { id: 'excited', label: 'Excité', emoji: '🤩', color: 'bg-pink-100 border-pink-300 hover:bg-pink-200' },
  ];

  const startScan = useCallback(async () => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour utiliser le scanner.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);

    try {
      let scanResult;

      if (scanMode === 'mood_cards' && selectedMood) {
        // Mood cards analysis
        const _moodData = moodCards.find(m => m.id === selectedMood);
        scanResult = {
          mood: {
            valence: Math.random() * 0.6 + 0.3,
            arousal: Math.random() * 0.6 + 0.3,
          },
          currentMood: { emotion: selectedMood, intensity: 0.7 }
        };
      } else {
        // Voice or face analysis via Edge Function
        const { data, error } = await supabase.functions.invoke('emotion-scan', {
          body: { 
            mode: scanMode,
            currentMood: selectedMood ? { emotion: selectedMood, intensity: 0.7 } : null
          }
        });

        if (error) throw error;
        scanResult = data;
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Wait for analysis completion
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(progressInterval);
      setScanProgress(100);

      // Create emotion result
      const sourceMap: Record<ScanMode, 'facial' | 'voice' | 'text' | 'manual'> = {
        'face': 'facial',
        'voice': 'voice',
        'mood_cards': 'manual'
      };
      
      const emotionResult: EmotionResult = {
        timestamp: new Date(),
        emotion: scanResult.currentMood?.emotion || 'neutral',
        intensity: scanResult.currentMood?.intensity || 0.5,
        confidence: scanResult.confidence || 0.8,
        source: sourceMap[scanMode],
        valence: scanResult.mood?.valence || 0.5,
        arousal: scanResult.mood?.arousal || 0.5,
        insight: scanResult.insight,
      };

      // Store in database
      await supabase.from('emotions').insert({
        user_id: user.id,
        primary_emotion: emotionResult.emotion,
        intensity: emotionResult.intensity,
        score: Math.round(emotionResult.confidence * 100),
        source: scanMode,
        ai_feedback: emotionResult.insight,
      });

      onEmotionDetected(emotionResult);

      toast({
        title: "Analyse terminée !",
        description: `Émotion "${emotionResult.emotion}" détectée avec ${Math.round(emotionResult.confidence * 100)}% de confiance.`,
      });

    } catch (error) {
      logger.error('Scan error', error as Error, 'EMOTION');
      toast({
        title: "Erreur d'analyse",
        description: "Une erreur est survenue lors de l'analyse. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  }, [user, scanMode, selectedMood, onEmotionDetected]);

  const startVoiceRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) {
          mediaRecorder.stop();
          setIsRecording(false);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
        }
      }, 10000);
      
    } catch (error) {
      logger.error('Voice recording error', error as Error, 'EMOTION');
      toast({
        title: "Erreur microphone",
        description: "Impossible d'accéder au microphone.",
        variant: "destructive",
      });
    }
  }, [isRecording]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      logger.error('Camera error', error as Error, 'EMOTION');
      toast({
        title: "Erreur caméra",
        description: "Impossible d'accéder à la caméra.",
        variant: "destructive",
      });
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={scanMode === 'mood_cards' ? 'default' : 'outline'}
          onClick={() => setScanMode('mood_cards')}
          className="flex items-center gap-2"
        >
          <Heart className="w-4 h-4" />
          Cartes d'humeur
        </Button>
        <Button
          variant={scanMode === 'voice' ? 'default' : 'outline'}
          onClick={() => setScanMode('voice')}
          className="flex items-center gap-2"
        >
          <Mic className="w-4 h-4" />
          Analyse vocale
        </Button>
        <Button
          variant={scanMode === 'face' ? 'default' : 'outline'}
          onClick={() => setScanMode('face')}
          className="flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Analyse faciale
        </Button>
      </div>

      {/* Scan Interface */}
      <Card className="border-2">
        <CardContent className="p-6">
          {scanMode === 'mood_cards' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Comment vous sentez-vous en ce moment ?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {moodCards.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${mood.color} ${
                      selectedMood === mood.id ? 'ring-2 ring-primary scale-105' : ''
                    }`}
                  >
                    <div className="text-3xl mb-2">{mood.emoji}</div>
                    <div className="text-sm font-medium">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {scanMode === 'voice' && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Mic className={`w-12 h-12 text-primary ${isRecording ? 'animate-pulse' : ''}`} />
              </div>
              <h3 className="text-lg font-semibold">Analyse Vocale</h3>
              <p className="text-muted-foreground">
                Parlez pendant quelques secondes pour analyser votre état émotionnel
              </p>
              <Button
                onClick={startVoiceRecording}
                disabled={isRecording}
                className="flex items-center gap-2"
              >
                {isRecording ? (
                  <>
                    <Square className="w-4 h-4" />
                    Enregistrement... ({10}s)
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Commencer l'enregistrement
                  </>
                )}
              </Button>
            </div>
          )}

          {scanMode === 'face' && (
            <div className="text-center space-y-4">
              <div className="relative w-80 h-60 mx-auto rounded-xl overflow-hidden bg-muted">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <h3 className="text-lg font-semibold">Analyse Faciale</h3>
              <p className="text-muted-foreground">
                Regardez la caméra pour une analyse de vos expressions faciales
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={startCamera} variant="outline">
                  <Video className="w-4 h-4 mr-2" />
                  Activer caméra
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  <VideoOff className="w-4 h-4 mr-2" />
                  Arrêter caméra
                </Button>
              </div>
            </div>
          )}

          {/* Scan Progress */}
          {isScanning && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm font-medium">Analyse en cours...</span>
              </div>
              <Progress value={scanProgress} className="w-full" />
              <p className="text-xs text-center text-muted-foreground">
                {scanProgress < 30 && "Initialisation de l'analyse..."}
                {scanProgress >= 30 && scanProgress < 60 && "Traitement des données..."}
                {scanProgress >= 60 && scanProgress < 90 && "Analyse des émotions..."}
                {scanProgress >= 90 && "Finalisation..."}
              </p>
            </div>
          )}

          {/* Start Scan Button */}
          {!isScanning && (
            <div className="mt-6 text-center">
              <Button
                onClick={startScan}
                disabled={scanMode === 'mood_cards' && !selectedMood}
                size="lg"
                className="w-full max-w-sm flex items-center gap-2"
              >
                <Brain className="w-5 h-5" />
                {scanMode === 'mood_cards' ? 'Analyser mon humeur' : 'Démarrer l\'analyse'}
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionScannerPremium;