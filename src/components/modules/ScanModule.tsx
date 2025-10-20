// @ts-nocheck
import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Scan, Camera, Mic, FileText, Brain, 
  PlayCircle, StopCircle, Eye, Heart, Zap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmotionService } from '@/services/emotionService';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface EmotionResult {
  emotion: string;
  confidence: number;
  source: 'text' | 'voice' | 'facial';
  timestamp: Date;
  details?: any;
}

export const ScanModule: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<EmotionResult | null>(null);
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([]);
  const [activeTab, setActiveTab] = useState<'text' | 'voice' | 'facial'>('text');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleTextScan = async () => {
    if (!textInput.trim()) {
      toast.error('Veuillez saisir du texte à analyser');
      return;
    }

    setIsScanning(true);
    try {
      const result = await EmotionService.analyzeText(textInput);
      setCurrentResult(result);
      setScanHistory(prev => [result, ...prev.slice(0, 9)]);
      toast.success('Analyse textuelle terminée');
    } catch (error) {
      toast.error('Erreur lors de l\'analyse textuelle');
      logger.error('Erreur analyse textuelle', error as Error, 'UI');
    } finally {
      setIsScanning(false);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        await analyzeVoice(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      toast.info('Enregistrement en cours...');
    } catch (error) {
      toast.error('Impossible d\'accéder au microphone');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeVoice = async (audioBlob: Blob) => {
    setIsScanning(true);
    try {
      const result = await EmotionService.analyzeAudio(audioBlob);
      setCurrentResult(result);
      setScanHistory(prev => [result, ...prev.slice(0, 9)]);
      toast.success('Analyse vocale terminée');
    } catch (error) {
      toast.error('Erreur lors de l\'analyse vocale');
      logger.error('Erreur analyse vocale', error as Error, 'UI');
    } finally {
      setIsScanning(false);
    }
  };

  const startFacialScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        toast.info('Caméra activée - Positionnez votre visage');
      }
    } catch (error) {
      toast.error('Impossible d\'accéder à la caméra');
    }
  };

  const captureFacialImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    setIsScanning(true);
    try {
      const imageData = canvas.toDataURL('image/jpeg');
      const result = await EmotionService.analyzeFacial(imageData);
      setCurrentResult(result);
      setScanHistory(prev => [result, ...prev.slice(0, 9)]);
      toast.success('Analyse faciale terminée');
      
      // Arrêter le stream vidéo
      const stream = video.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      toast.error('Erreur lors de l\'analyse faciale');
      logger.error('Erreur analyse faciale', error as Error, 'UI');
    } finally {
      setIsScanning(false);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      'joy': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'sadness': 'bg-blue-100 text-blue-800 border-blue-200',
      'anger': 'bg-red-100 text-red-800 border-red-200',
      'fear': 'bg-purple-100 text-purple-800 border-purple-200',
      'surprise': 'bg-orange-100 text-orange-800 border-orange-200',
      'disgust': 'bg-green-100 text-green-800 border-green-200',
      'neutral': 'bg-gray-100 text-gray-800 border-gray-200',
      'calm': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[emotion.toLowerCase()] || colors.neutral;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Scan className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Scan Émotionnel</h1>
          <p className="text-muted-foreground">
            Analyse multi-modale de vos émotions en temps réel
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interface de scan */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Analyseur Émotionnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Texte
                  </TabsTrigger>
                  <TabsTrigger value="voice" className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Voix
                  </TabsTrigger>
                  <TabsTrigger value="facial" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Facial
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-4">
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Décrivez votre état émotionnel, votre journée, ou exprimez ce que vous ressentez..."
                      className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/20"
                      disabled={isScanning}
                    />
                    <Button
                      onClick={handleTextScan}
                      disabled={!textInput.trim() || isScanning}
                      className="w-full"
                    >
                      {isScanning ? (
                        <>
                          <Brain className="h-4 w-4 mr-2 animate-pulse" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <Scan className="h-4 w-4 mr-2" />
                          Analyser le texte
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="voice" className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <Mic className={`h-12 w-12 text-primary ${isRecording ? 'animate-pulse' : ''}`} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isRecording 
                        ? 'Parlez maintenant... Exprimez vos sentiments naturellement'
                        : 'Cliquez pour commencer l\'enregistrement vocal'
                      }
                    </p>
                    <Button
                      onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                      disabled={isScanning}
                      variant={isRecording ? 'destructive' : 'default'}
                      className="w-full"
                    >
                      {isRecording ? (
                        <>
                          <StopCircle className="h-4 w-4 mr-2" />
                          Arrêter l'enregistrement
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Commencer l'enregistrement
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="facial" className="space-y-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <video
                        ref={videoRef}
                        className="w-full h-48 bg-black rounded-lg object-cover"
                        muted
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      {!videoRef.current?.srcObject && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                          <div className="text-center">
                            <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Caméra non activée
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={startFacialScan}
                        variant="outline"
                        disabled={isScanning}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Activer caméra
                      </Button>
                      <Button
                        onClick={captureFacialImage}
                        disabled={!videoRef.current?.srcObject || isScanning}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Capturer & analyser
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Résultats */}
        <div className="space-y-4">
          {/* Résultat actuel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résultat Actuel</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {isScanning ? (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6"
                  >
                    <Zap className="h-8 w-8 mx-auto mb-3 text-primary animate-pulse" />
                    <p className="text-sm text-muted-foreground">Analyse en cours...</p>
                    <Progress value={65} className="mt-3" />
                  </motion.div>
                ) : currentResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="text-center">
                      <Badge className={`${getEmotionColor(currentResult.emotion)} px-3 py-1`}>
                        {currentResult.emotion}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Confiance:</span>
                        <span className="font-medium">
                          {Math.round(currentResult.confidence * 100)}%
                        </span>
                      </div>
                      <Progress value={currentResult.confidence * 100} />
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Source:</span>
                        <span>{currentResult.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Heure:</span>
                        <span>{currentResult.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 text-muted-foreground"
                  >
                    <Heart className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Aucune analyse disponible</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Historique */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scanHistory.length > 0 ? (
                  scanHistory.map((result, index) => (
                    <motion.div
                      key={`${result.timestamp.getTime()}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-2 rounded border"
                    >
                      <div className="flex items-center gap-2">
                        <Badge className={`${getEmotionColor(result.emotion)} text-xs`}>
                          {result.emotion}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {result.source}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucun historique
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};