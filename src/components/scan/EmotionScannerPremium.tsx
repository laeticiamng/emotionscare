/**
 * SCANNER ÉMOTION PREMIUM - COMPOSANT AVANCÉ
 * Scanner multimodal avec intégration Hume, OpenAI et interface accessible
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  Mic, 
  MessageSquare, 
  Brain, 
  Zap,
  Play,
  Square,
  Loader2,
  CheckCircle,
  AlertCircle,
  Volume2,
  Eye,
  Sparkles,
  Heart,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmotionAnalysisEngine } from '@/hooks/useEmotionAnalysisEngine';
import { EmotionResult, ScanMode } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface EmotionScannerPremiumProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  autoGenerateMusic?: boolean;
  showRecommendations?: boolean;
  allowedModes?: ScanMode[];
}

const EmotionScannerPremium: React.FC<EmotionScannerPremiumProps> = ({
  onEmotionDetected,
  autoGenerateMusic = true,
  showRecommendations = true,
  allowedModes = ['facial', 'voice', 'text', 'combined']
}) => {
  const [activeMode, setActiveMode] = useState<ScanMode>('facial');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isAnalyzing,
    currentResult,
    error,
    isSessionActive,
    startAnalysisSession,
    endAnalysisSession,
    analyzeFacialEmotion,
    analyzeVoiceEmotion,
    analyzeTextEmotion,
    analyzeMultimodal,
    clearError
  } = useEmotionAnalysisEngine();

  // === GESTION CAMÉRA ===
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        }
      });
      
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('❌ Erreur caméra:', error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/jpeg', 0.8);
    });
  }, []);

  // === GESTION AUDIO ===
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        try {
          await analyzeVoiceEmotion(audioBlob, {
            saveToHistory: true,
            generateRecommendations: showRecommendations
          });
        } catch (error) {
          console.error('❌ Erreur analyse audio:', error);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      // Timer d'enregistrement
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('❌ Erreur enregistrement:', error);
    }
  }, [analyzeVoiceEmotion, showRecommendations]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  }, [isRecording]);

  // === HANDLERS D'ANALYSE ===
  const handleFacialScan = useCallback(async () => {
    if (!isSessionActive) {
      startAnalysisSession();
    }

    await startCamera();
    
    // Attendre que la caméra soit prête
    setTimeout(async () => {
      try {
        const imageBlob = await capturePhoto();
        if (imageBlob) {
          const result = await analyzeFacialEmotion(imageBlob, {
            saveToHistory: true,
            generateRecommendations: showRecommendations
          });
          
          onEmotionDetected?.(result);
        }
      } catch (error) {
        console.error('❌ Erreur scan facial:', error);
      } finally {
        stopCamera();
      }
    }, 1000);
  }, [
    isSessionActive, 
    startAnalysisSession, 
    startCamera, 
    capturePhoto, 
    analyzeFacialEmotion, 
    showRecommendations, 
    onEmotionDetected, 
    stopCamera
  ]);

  const handleVoiceScan = useCallback(async () => {
    if (!isSessionActive) {
      startAnalysisSession();
    }

    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  }, [isSessionActive, startAnalysisSession, isRecording, stopRecording, startRecording]);

  const handleTextScan = useCallback(async () => {
    if (!textInput.trim()) return;

    if (!isSessionActive) {
      startAnalysisSession();
    }

    try {
      const result = await analyzeTextEmotion(textInput, {
        saveToHistory: true,
        generateRecommendations: showRecommendations
      });
      
      onEmotionDetected?.(result);
      setTextInput('');
    } catch (error) {
      console.error('❌ Erreur analyse texte:', error);
    }
  }, [textInput, isSessionActive, startAnalysisSession, analyzeTextEmotion, showRecommendations, onEmotionDetected]);

  const handleMultimodalScan = useCallback(async () => {
    if (!isSessionActive) {
      startAnalysisSession();
    }

    try {
      // Capturer photo
      await startCamera();
      await new Promise(resolve => setTimeout(resolve, 1000));
      const imageBlob = await capturePhoto();
      stopCamera();

      // Analyser multimodal
      const result = await analyzeMultimodal({
        image: imageBlob,
        text: textInput.trim() || undefined
      }, {
        saveToHistory: true,
        generateRecommendations: showRecommendations
      });

      onEmotionDetected?.(result);
      setTextInput('');
    } catch (error) {
      console.error('❌ Erreur analyse multimodale:', error);
    }
  }, [
    isSessionActive,
    startAnalysisSession,
    startCamera,
    capturePhoto,
    stopCamera,
    analyzeMultimodal,
    textInput,
    showRecommendations,
    onEmotionDetected
  ]);

  // === FORMATAGE DES RÉSULTATS ===
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: 'text-yellow-500',
      calm: 'text-blue-500',
      focused: 'text-purple-500',
      energetic: 'text-orange-500',
      sad: 'text-gray-500',
      anxious: 'text-red-500'
    };
    return colors[emotion] || 'text-gray-500';
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis: Record<string, string> = {
      happy: '😊',
      calm: '😌',
      focused: '🎯',
      energetic: '⚡',
      sad: '😔',
      anxious: '😰'
    };
    return emojis[emotion] || '😐';
  };

  return (
    <div className="space-y-6">
      {/* === SÉLECTEUR DE MODE === */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Scanner Émotionnel Premium
            {isSessionActive && (
              <Badge variant="secondary" className="ml-2">
                Session active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allowedModes.includes('facial') && (
              <Button
                variant={activeMode === 'facial' ? 'default' : 'outline'}
                className="h-20 flex-col gap-2"
                onClick={() => setActiveMode('facial')}
              >
                <Camera className="w-6 h-6" />
                <span className="text-sm">Facial</span>
              </Button>
            )}
            
            {allowedModes.includes('voice') && (
              <Button
                variant={activeMode === 'voice' ? 'default' : 'outline'}
                className="h-20 flex-col gap-2"
                onClick={() => setActiveMode('voice')}
              >
                <Mic className="w-6 h-6" />
                <span className="text-sm">Vocal</span>
              </Button>
            )}
            
            {allowedModes.includes('text') && (
              <Button
                variant={activeMode === 'text' ? 'default' : 'outline'}
                className="h-20 flex-col gap-2"
                onClick={() => setActiveMode('text')}
              >
                <MessageSquare className="w-6 h-6" />
                <span className="text-sm">Textuel</span>
              </Button>
            )}
            
            {allowedModes.includes('combined') && (
              <Button
                variant={activeMode === 'combined' ? 'default' : 'outline'}
                className="h-20 flex-col gap-2"
                onClick={() => setActiveMode('combined')}
              >
                <Sparkles className="w-6 h-6" />
                <span className="text-sm">Multimodal</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* === INTERFACE D'ANALYSE === */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {activeMode === 'facial' && 'Analyse Faciale'}
              {activeMode === 'voice' && 'Analyse Vocale'}
              {activeMode === 'text' && 'Analyse Textuelle'}
              {activeMode === 'combined' && 'Analyse Multimodale'}
            </span>
            {isAnalyzing && <LoadingSpinner size="sm" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Analyse Faciale */}
          {activeMode === 'facial' && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full max-w-md mx-auto rounded-lg bg-muted"
                  autoPlay
                  muted
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {cameraStream && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-red-500 text-white">
                      <Eye className="w-3 h-3 mr-1" />
                      En direct
                    </Badge>
                  </div>
                )}
              </div>
              
              <Button
                size="lg"
                onClick={handleFacialScan}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 mr-2" />
                )}
                {isAnalyzing ? 'Analyse en cours...' : 'Capturer et Analyser'}
              </Button>
            </div>
          )}

          {/* Analyse Vocale */}
          {activeMode === 'voice' && (
            <div className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                {isRecording ? (
                  <div className="space-y-4">
                    <div className="w-20 h-20 mx-auto bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      <Mic className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-lg font-medium">Enregistrement en cours...</p>
                    <p className="text-muted-foreground">
                      {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                    </p>
                    <Progress value={(recordingDuration / 30) * 100} className="max-w-xs mx-auto" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Volume2 className="w-16 h-16 mx-auto text-muted-foreground" />
                    <p className="text-lg font-medium">Prêt à enregistrer</p>
                    <p className="text-muted-foreground">
                      Parlez naturellement pendant 10-30 secondes
                    </p>
                  </div>
                )}
              </div>
              
              <Button
                size="lg"
                onClick={handleVoiceScan}
                disabled={isAnalyzing}
                className="w-full"
                variant={isRecording ? "destructive" : "default"}
              >
                {isRecording ? (
                  <Square className="w-5 h-5 mr-2" />
                ) : (
                  <Play className="w-5 h-5 mr-2" />
                )}
                {isRecording ? 'Arrêter l\'enregistrement' : 'Commencer l\'enregistrement'}
              </Button>
            </div>
          )}

          {/* Analyse Textuelle */}
          {activeMode === 'text' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Décrivez votre état émotionnel, vos pensées ou ce que vous ressentez en ce moment..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-32 resize-none"
                maxLength={500}
              />
              
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{textInput.length}/500 caractères</span>
                <span>Minimum 10 caractères recommandé</span>
              </div>
              
              <Button
                size="lg"
                onClick={handleTextScan}
                disabled={isAnalyzing || textInput.trim().length < 10}
                className="w-full"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <MessageSquare className="w-5 h-5 mr-2" />
                )}
                {isAnalyzing ? 'Analyse en cours...' : 'Analyser le Texte'}
              </Button>
            </div>
          )}

          {/* Analyse Multimodale */}
          {activeMode === 'combined' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Capture Faciale</h4>
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full rounded-lg bg-muted"
                      autoPlay
                      muted
                      playsInline
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description (Optionnel)</h4>
                  <Textarea
                    placeholder="Ajoutez une description de votre état..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="min-h-32 resize-none"
                    maxLength={200}
                  />
                </div>
              </div>
              
              <Button
                size="lg"
                onClick={handleMultimodalScan}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-5 h-5 mr-2" />
                )}
                {isAnalyzing ? 'Analyse multimodale...' : 'Analyse Complète'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* === RÉSULTATS === */}
      {(currentResult || error) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {error ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              Résultats d'Analyse
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="space-y-3">
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
                <Button variant="outline" onClick={clearError}>
                  Réessayer
                </Button>
              </div>
            ) : currentResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {getEmotionEmoji(currentResult.emotion)}
                    </span>
                    <div>
                      <h3 className={cn('text-xl font-semibold capitalize', getEmotionColor(currentResult.emotion))}>
                        {currentResult.emotion}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Confiance: {Math.round((typeof currentResult.confidence === 'number' ? currentResult.confidence : 0.5) * 100)}%
                      </p>
                    </div>
                  </div>
                  
                  <Badge variant="outline">
                    {currentResult.source === 'facial_analysis' && 'Facial'}
                    {currentResult.source === 'voice_analysis' && 'Vocal'}
                    {currentResult.source === 'text_analysis' && 'Textuel'}
                    {currentResult.source === 'multimodal' && 'Multimodal'}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Intensité:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={currentResult.intensity * 100} className="flex-1" />
                      <span className="font-medium">{Math.round(currentResult.intensity * 100)}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Source:</span>
                    <p className="font-medium mt-1 capitalize">
                      {currentResult.scanMode || currentResult.source.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                
                {currentResult.recommendations && currentResult.recommendations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Recommandations
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {currentResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <TrendingUp className="w-3 h-3 mt-0.5 text-primary flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmotionScannerPremium;