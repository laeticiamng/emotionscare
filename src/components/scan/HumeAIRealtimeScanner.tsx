/**
 * Hume AI Real-time Emotion Scanner
 * Displays live emotion streaming with WebSocket
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Camera,
  Mic,
  Type,
  Wifi,
  WifiOff,
  Loader2,
  Play,
  Square,
  AlertTriangle,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { useHumeAI } from '@/hooks/useHumeAI';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { HumeEmotionResult, EmotionPrediction } from '@/services/ai/HumeAIWebSocketService';

export interface HumeAIRealtimeScannerProps {
  apiKey: string;
  mode?: 'face' | 'prosody' | 'language';
  onEmotionDetected?: (result: HumeEmotionResult) => void;
  autoConnect?: boolean;
}

const EMOTION_COLORS: Record<string, string> = {
  Joy: 'text-yellow-600',
  Happiness: 'text-yellow-500',
  Excitement: 'text-orange-500',
  Love: 'text-pink-500',
  Sadness: 'text-blue-600',
  Anger: 'text-red-600',
  Fear: 'text-purple-600',
  Disgust: 'text-green-700',
  Surprise: 'text-cyan-500',
  Neutral: 'text-gray-500',
  Calmness: 'text-emerald-500',
  Anxiety: 'text-amber-600',
  Contempt: 'text-slate-600',
};

export const HumeAIRealtimeScanner: React.FC<HumeAIRealtimeScannerProps> = ({
  apiKey,
  mode = 'face',
  onEmotionDetected,
  autoConnect = false,
}) => {
  const { toast } = useToast();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamType, setStreamType] = useState<'video' | 'audio' | 'text' | null>(null);
  const [textInput, setTextInput] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isConnected,
    isConnecting,
    connectionError,
    currentEmotion,
    emotionHistory,
    connect,
    disconnect,
    sendAudioData,
    sendVideoFrame,
    sendText,
    clearHistory,
  } = useHumeAI({
    apiKey,
    modelType: mode,
    autoConnect,
    reconnectAttempts: 5,
    onEmotionUpdate: (result) => {
      if (onEmotionDetected) {
        onEmotionDetected(result);
      }
    },
    onError: (error) => {
      toast({
        title: 'Erreur de connexion',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    return () => {
      stopStreaming();
      disconnect();
    };
  }, []);

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: 'Connecté',
        description: 'Connexion établie avec Hume AI',
      });
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: 'Impossible de se connecter à Hume AI',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = () => {
    stopStreaming();
    disconnect();
    toast({
      title: 'Déconnecté',
      description: 'Connexion fermée',
    });
  };

  const startVideoStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
      }

      // Send frames periodically (every 500ms)
      streamIntervalRef.current = setInterval(() => {
        captureAndSendFrame();
      }, 500);

      setIsStreaming(true);
      setStreamType('video');

      toast({
        title: 'Streaming vidéo démarré',
        description: 'Analyse faciale en temps réel',
      });
    } catch (error) {
      toast({
        title: 'Erreur caméra',
        description: "Impossible d'accéder à la caméra",
        variant: 'destructive',
      });
    }
  };

  const captureAndSendFrame = () => {
    if (!videoRef.current || !canvasRef.current || !isConnected) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    sendVideoFrame(imageData);
  };

  const startAudioStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (audioChunks.length > 0 && isConnected) {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          sendAudioData(audioBlob);
        }
        audioChunks.length = 0;
      };

      // Record in 2-second chunks
      mediaRecorder.start();
      streamIntervalRef.current = setInterval(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          mediaRecorder.start();
        }
      }, 2000);

      setIsStreaming(true);
      setStreamType('audio');

      toast({
        title: 'Streaming audio démarré',
        description: 'Analyse vocale en temps réel',
      });
    } catch (error) {
      toast({
        title: 'Erreur microphone',
        description: "Impossible d'accéder au microphone",
        variant: 'destructive',
      });
    }
  };

  const handleTextAnalysis = () => {
    if (!textInput.trim() || !isConnected) return;

    sendText(textInput);
    setTextInput('');

    toast({
      title: 'Texte envoyé',
      description: 'Analyse en cours...',
    });
  };

  const stopStreaming = () => {
    // Stop interval
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }

    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Clear video
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    setStreamType(null);
  };

  const topEmotions = currentEmotion
    ? currentEmotion.emotions
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
    : [];

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Hume AI - Streaming Temps Réel
            </div>
            <Badge
              variant={isConnected ? 'default' : 'secondary'}
              className={cn(
                'gap-1',
                isConnected && 'bg-green-600 hover:bg-green-700'
              )}
            >
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3" />
                  Connecté
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  Déconnecté
                </>
              )}
            </Badge>
          </CardTitle>
          <CardDescription>
            {mode === 'face' && 'Analyse faciale en temps réel'}
            {mode === 'prosody' && 'Analyse vocale en temps réel'}
            {mode === 'language' && 'Analyse textuelle en temps réel'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected && !isConnecting && (
            <Button onClick={handleConnect} className="w-full">
              <Wifi className="h-4 w-4 mr-2" />
              Connecter à Hume AI
            </Button>
          )}

          {isConnecting && (
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connexion en cours...
            </Button>
          )}

          {isConnected && !isStreaming && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {mode === 'face' && (
                <Button onClick={startVideoStreaming} variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Caméra
                </Button>
              )}
              {mode === 'prosody' && (
                <Button onClick={startAudioStreaming} variant="outline">
                  <Mic className="h-4 w-4 mr-2" />
                  Microphone
                </Button>
              )}
              {mode === 'language' && (
                <Button onClick={() => setStreamType('text')} variant="outline">
                  <Type className="h-4 w-4 mr-2" />
                  Texte
                </Button>
              )}
            </div>
          )}

          {isConnected && isStreaming && (
            <Button
              onClick={stopStreaming}
              variant="destructive"
              className="w-full"
            >
              <Square className="h-4 w-4 mr-2" />
              Arrêter le streaming
            </Button>
          )}

          {isConnected && (
            <Button
              onClick={handleDisconnect}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Se déconnecter
            </Button>
          )}

          {connectionError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erreur de connexion</AlertTitle>
              <AlertDescription>{connectionError.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Video Stream */}
      {streamType === 'video' && (
        <Card>
          <CardContent className="pt-6">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-auto"
              />
              <canvas ref={canvasRef} className="hidden" />
              {isStreaming && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-600 animate-pulse">
                    <div className="h-2 w-2 rounded-full bg-white mr-2" />
                    LIVE
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio Stream */}
      {streamType === 'audio' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div
                className={cn(
                  'p-6 rounded-full bg-primary/10',
                  isStreaming && 'animate-pulse'
                )}
              >
                <Mic
                  className={cn(
                    'h-16 w-16',
                    isStreaming ? 'text-red-500' : 'text-muted-foreground'
                  )}
                />
              </div>
              <p className="text-lg font-medium">
                {isStreaming ? 'Écoute en cours...' : 'Microphone prêt'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Input */}
      {streamType === 'text' && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Écrivez vos pensées ou émotions..."
              rows={4}
              className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={handleTextAnalysis}
              disabled={!textInput.trim() || !isConnected}
              className="w-full"
            >
              Analyser le texte
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Emotion Display */}
      {currentEmotion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Émotion Détectée
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Top Emotion */}
            <div className="text-center space-y-2">
              <div
                className={cn(
                  'text-6xl font-bold',
                  EMOTION_COLORS[currentEmotion.topEmotion.name] || 'text-foreground'
                )}
              >
                {currentEmotion.topEmotion.name}
              </div>
              <div className="text-2xl text-muted-foreground">
                {Math.round(currentEmotion.topEmotion.score * 100)}% de confiance
              </div>
            </div>

            {/* Top 5 Emotions */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Répartition des émotions
              </h4>
              {topEmotions.map((emotion: EmotionPrediction) => (
                <div key={emotion.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={cn(
                        'font-medium',
                        EMOTION_COLORS[emotion.name] || 'text-foreground'
                      )}
                    >
                      {emotion.name}
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round(emotion.score * 100)}%
                    </span>
                  </div>
                  <Progress value={emotion.score * 100} className="h-2" />
                </div>
              ))}
            </div>

            {/* Prosody Data (if available) */}
            {currentEmotion.prosody && (
              <div className="pt-4 border-t space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Données vocales
                </h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">
                      {currentEmotion.prosody.pitch.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Tonalité</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {currentEmotion.prosody.tempo.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Tempo</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {currentEmotion.prosody.volume.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Volume</div>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className="text-xs text-center text-muted-foreground">
              Dernière mise à jour :{' '}
              {new Date(currentEmotion.timestamp).toLocaleTimeString('fr-FR')}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emotion History */}
      {emotionHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Historique des émotions</span>
              <Button onClick={clearHistory} variant="ghost" size="sm">
                Effacer
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {emotionHistory.slice(0, 10).map((result, index) => (
                <div
                  key={`${result.timestamp}-${index}`}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'font-medium',
                        EMOTION_COLORS[result.topEmotion.name] || 'text-foreground'
                      )}
                    >
                      {result.topEmotion.name}
                    </span>
                    <Badge variant="secondary">
                      {Math.round(result.topEmotion.score * 100)}%
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(result.timestamp).toLocaleTimeString('fr-FR')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
