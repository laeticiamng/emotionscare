// @ts-nocheck

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Mic, Type, Upload, Play, Square, Loader2 } from 'lucide-react';
import { useEmotionAnalysis } from '@/hooks/useEmotionAnalysis';
import { EmotionResult } from '@/types/emotion';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { useToast } from '@/hooks/use-toast';

interface EmotionScannerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  onScanComplete?: (result: EmotionResult) => void;
}

const EmotionScanner: React.FC<EmotionScannerProps> = ({
  onEmotionDetected,
  onScanComplete
}) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('text');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { toast } = useToast();
  const { 
    analyzeText, 
    analyzeFacial, 
    analyzeVoice,
    isAnalyzing, 
    error, 
    lastResult,
    resetAnalysis 
  } = useEmotionAnalysis();
  
  const { activateMusicForEmotion } = useMusicEmotionIntegration();

  const handleEmotionResult = useCallback((result: EmotionResult) => {
    if (onEmotionDetected) {
      onEmotionDetected(result);
    }
    if (onScanComplete) {
      onScanComplete(result);
    }
    
    // Auto-activate music for detected emotion
    activateMusicForEmotion({
      emotion: result.emotion,
      intensity: result.confidence
    }).catch(() => {
      // Music activation failed - silent
    });
    
    toast({
      title: "Analyse terminée",
      description: `Émotion détectée : ${result.emotion} (${Math.round(result.confidence * 100)}%)`,
    });
  }, [onEmotionDetected, onScanComplete, activateMusicForEmotion, toast]);

  const handleTextAnalysis = async () => {
    if (!text.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir du texte à analyser",
        variant: "destructive"
      });
      return;
    }
    
    const result = await analyzeText(text);
    if (result) {
      handleEmotionResult(result);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      // Camera access error
      toast({
        title: "Erreur caméra",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive"
      });
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !streamRef.current) return;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    if (context) {
      context.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const result = await analyzeFacial(blob);
          if (result) {
            handleEmotionResult(result);
          }
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image valide",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedImage(file);
    const result = await analyzeFacial(file);
    if (result) {
      handleEmotionResult(result);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const result = await analyzeVoice(audioBlob);
        if (result) {
          handleEmotionResult(result);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Enregistrement démarré",
        description: "Parlez maintenant...",
      });
    } catch (err) {
      // Microphone access error
      toast({
        title: "Erreur microphone",
        description: "Impossible d'accéder au microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      toast({
        title: "Enregistrement terminé",
        description: "Analyse en cours...",
      });
    }
  };

  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-6 w-6" />
          Scanner Émotionnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Texte
            </TabsTrigger>
            <TabsTrigger value="facial" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Visuel
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Vocal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <Textarea
              placeholder="Décrivez votre état émotionnel ou vos pensées..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
            <Button 
              onClick={handleTextAnalysis}
              disabled={isAnalyzing || !text.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                'Analyser le texte'
              )}
            </Button>
          </TabsContent>

          <TabsContent value="facial" className="space-y-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <video 
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full max-w-md mx-auto rounded-lg"
                  style={{ display: streamRef.current ? 'block' : 'none' }}
                />
                {!streamRef.current && (
                  <div className="text-center py-8">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Caméra non activée</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={startCamera}
                  variant="outline"
                  className="flex-1"
                >
                  Activer la caméra
                </Button>
                <Button 
                  onClick={capturePhoto}
                  disabled={!streamRef.current || isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyse...
                    </>
                  ) : (
                    'Capturer et analyser'
                  )}
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                  disabled={isAnalyzing}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Télécharger une image
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            <div className="text-center space-y-4">
              <div className="border rounded-lg p-8">
                <Mic className={`h-16 w-16 mx-auto mb-4 ${isRecording ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
                <p className="text-muted-foreground">
                  {isRecording ? 'Enregistrement en cours...' : 'Prêt à enregistrer'}
                </p>
              </div>
              
              <Button 
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isAnalyzing}
                className={`w-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : isRecording ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Arrêter l'enregistrement
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Commencer l'enregistrement
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetAnalysis}
              className="mt-2"
            >
              Réessayer
            </Button>
          </div>
        )}

        {lastResult && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
              Résultat de l'analyse
            </h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Émotion :</span> {lastResult.emotion}</p>
              <p><span className="font-medium">Confiance :</span> {Math.round(lastResult.confidence * 100)}%</p>
              <p><span className="font-medium">Source :</span> {lastResult.source}</p>
              {lastResult.transcription && (
                <p><span className="font-medium">Transcription :</span> {lastResult.transcription}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionScanner;
