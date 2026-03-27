// @ts-nocheck
import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Camera, 
  Mic, 
  FileText, 
  Heart,
  AlertCircle,
  CheckCircle,
  Loader2,
  Play,
  Square,
  Upload,
  Zap,
  TrendingUp,
  Eye,
  MessageSquare
} from 'lucide-react';
import { logger } from '@/lib/logger';

interface EmotionResult {
  emotion: string;
  confidence: number;
  valence: number; // -1 (négatif) à +1 (positif)  
  arousal: number; // 0 (calme) à 1 (excité)
  suggestions: string[];
  timestamp: Date;
  source: 'text' | 'voice' | 'facial' | 'multimodal';
  metrics?: {
    heartRate?: number;
    stressLevel?: number;
    energyLevel?: number;
  };
}

interface EmotionAnalysisEngineProps {
  onResult?: (result: EmotionResult) => void;
  enabledModes?: ('text' | 'voice' | 'facial' | 'multimodal')[];
  showHistory?: boolean;
  realTimeMode?: boolean;
}

/**
 * Moteur d'analyse émotionnelle unifié
 * Centralise toutes les capacités d'analyse (texte, voix, facial, multimodal)
 */
const EmotionAnalysisEngine: React.FC<EmotionAnalysisEngineProps> = ({
  onResult,
  enabledModes = ['text', 'voice', 'facial'],
  showHistory = true,
  realTimeMode = false
}) => {
  const [activeMode, setActiveMode] = useState<string>(enabledModes[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentResult, setCurrentResult] = useState<EmotionResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<EmotionResult[]>([]);
  const [textInput, setTextInput] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Simulation d'analyse émotionnelle avancée
  const analyzeEmotion = useCallback(async (
    input: string | Blob | ImageData, 
    mode: 'text' | 'voice' | 'facial' | 'multimodal'
  ): Promise<EmotionResult> => {
    setIsAnalyzing(true);

    // Simulation de délai d'analyse IA
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const emotions = ['joie', 'tristesse', 'colère', 'peur', 'surprise', 'dégoût', 'neutre', 'calme', 'anxieux', 'content'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    const result: EmotionResult = {
      emotion: randomEmotion,
      confidence: 0.75 + Math.random() * 0.24, // 75-99%
      valence: (Math.random() - 0.5) * 2, // -1 à +1
      arousal: Math.random(), // 0 à 1
      suggestions: generateSuggestions(randomEmotion),
      timestamp: new Date(),
      source: mode,
      metrics: {
        heartRate: 60 + Math.random() * 40, // 60-100 bpm
        stressLevel: Math.random(),
        energyLevel: Math.random()
      }
    };

    setCurrentResult(result);
    setAnalysisHistory(prev => [result, ...prev.slice(0, 9)]); // Garde 10 derniers
    onResult?.(result);
    setIsAnalyzing(false);

    return result;
  }, [onResult]);

  const generateSuggestions = (emotion: string): string[] => {
    const suggestionMap: Record<string, string[]> = {
      'joie': [
        'Partagez cette énergie positive avec votre entourage',
        'Profitez de ce moment pour planifier vos prochains objectifs',
        'Pratiquez la gratitude pour ancrer ce sentiment'
      ],
      'tristesse': [
        'Accordez-vous du temps pour ressentir cette émotion',
        'Contactez un proche ou un thérapeute si nécessaire',
        'Pratiquez une activité créative ou de méditation'
      ],
      'colère': [
        'Pratiquez des exercices de respiration profonde',
        'Faites une pause avant de prendre des décisions',
        'Canalisez cette énergie dans une activité physique'
      ],
      'anxieux': [
        'Utilisez la technique 5-4-3-2-1 pour vous ancrer',
        'Pratiquez la respiration carrée (4-4-4-4)',
        'Écoutez de la musique apaisante ou des sons de nature'
      ],
      'neutre': [
        'C\'est un bon moment pour faire du planning',
        'Explorez de nouvelles activités pour stimuler votre bien-être',
        'Pratiquez la pleine conscience pour vous connecter à l\'instant'
      ]
    };

    return suggestionMap[emotion] || [
      'Continuez à observer vos émotions sans jugement',
      'Pratiquez l\'auto-compassion',
      'N\'hésitez pas à demander de l\'aide si nécessaire'
    ];
  };

  // Analyse textuelle
  const handleTextAnalysis = async () => {
    if (!textInput.trim()) return;
    await analyzeEmotion(textInput, 'text');
  };

  // Analyse vocale
  const handleVoiceAnalysis = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        const audioChunks: Blob[] = [];
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          await analyzeEmotion(audioBlob, 'voice');
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        setIsRecording(true);
        
        // Arrêt automatique après 10 secondes
        setTimeout(() => {
          if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
          }
        }, 10000);
        
      } catch (error) {
        logger.error('Erreur accès microphone', error as Error, 'UI');
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  // Analyse faciale
  const startFacialAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      logger.error('Erreur accès caméra', error as Error, 'UI');
    }
  };

  const captureFacialEmotion = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        await analyzeEmotion(imageData, 'facial');
      }
    }
  };

  const getEmotionColor = (emotion: string, valence: number, arousal: number) => {
    // Couleurs basées sur le modèle circomplexe des émotions
    if (valence > 0.2 && arousal > 0.6) return 'text-yellow-600 bg-yellow-100'; // Joie/Excitation
    if (valence > 0.2 && arousal < 0.4) return 'text-green-600 bg-green-100'; // Calme/Contentement
    if (valence < -0.2 && arousal > 0.6) return 'text-red-600 bg-red-100'; // Colère/Peur
    if (valence < -0.2 && arousal < 0.4) return 'text-blue-600 bg-blue-100'; // Tristesse
    return 'text-gray-600 bg-gray-100'; // Neutre
  };

  const getEmotionIcon = (emotion: string) => {
    const icons = {
      'joie': '😊', 'tristesse': '😢', 'colère': '😠', 
      'peur': '😰', 'surprise': '😲', 'dégoût': '🤢',
      'neutre': '😐', 'calme': '😌', 'anxieux': '😰', 'content': '😊'
    };
    return icons[emotion as keyof typeof icons] || '🤔';
  };

  return (
    <div className="space-y-6">
      {/* Interface principale */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            Moteur d'Analyse Émotionnelle IA
            <Badge variant="secondary">v2.0</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeMode} onValueChange={setActiveMode}>
            <TabsList className="grid w-full grid-cols-4">
              {enabledModes.includes('text') && (
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Texte
                </TabsTrigger>
              )}
              {enabledModes.includes('voice') && (
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Voix
                </TabsTrigger>
              )}
              {enabledModes.includes('facial') && (
                <TabsTrigger value="facial" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Facial
                </TabsTrigger>
              )}
              {enabledModes.includes('multimodal') && (
                <TabsTrigger value="multimodal" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Multi-modal
                </TabsTrigger>
              )}
            </TabsList>

            {/* Analyse textuelle */}
            <TabsContent value="text" className="space-y-4 mt-6">
              <div className="space-y-3">
                <textarea
                  placeholder="Décrivez vos sentiments actuels... Comment vous sentez-vous aujourd'hui ?"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full min-h-24 p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isAnalyzing}
                />
                <Button 
                  onClick={handleTextAnalysis}
                  disabled={!textInput.trim() || isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analyser le texte
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Analyse vocale */}
            <TabsContent value="voice" className="space-y-4 mt-6">
              <div className="text-center space-y-4">
                <motion.div
                  className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${
                    isRecording ? 'bg-red-100' : 'bg-primary/10'
                  }`}
                  animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: isRecording ? Infinity : 0, duration: 1 }}
                >
                  <Mic className={`h-8 w-8 ${isRecording ? 'text-red-500' : 'text-primary'}`} />
                </motion.div>
                
                <Button 
                  onClick={handleVoiceAnalysis}
                  disabled={isAnalyzing}
                  variant={isRecording ? 'destructive' : 'default'}
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : isRecording ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Arrêter (10s max)
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Commencer l'enregistrement
                    </>
                  )}
                </Button>
                
                {isRecording && (
                  <p className="text-sm text-muted-foreground">
                    Parlez naturellement... L'enregistrement s'arrêtera automatiquement.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Analyse faciale */}
            <TabsContent value="facial" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                    playsInline
                    muted
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {!videoRef.current?.srcObject && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button onClick={startFacialAnalysis} variant="secondary">
                        <Camera className="h-4 w-4 mr-2" />
                        Activer la caméra
                      </Button>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={captureFacialEmotion}
                  disabled={!videoRef.current?.srcObject || isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Capturer et analyser
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Mode multimodal */}
            <TabsContent value="multimodal" className="space-y-4 mt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center gap-4">
                  <div className="p-4 rounded-full bg-blue-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-2xl">+</span>
                  <div className="p-4 rounded-full bg-green-100">
                    <Mic className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-2xl">+</span>
                  <div className="p-4 rounded-full bg-purple-100">
                    <Camera className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                
                <Button size="lg" variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <Zap className="h-4 w-4 mr-2" />
                  Analyse Multi-modale
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  Combine texte, voix et analyse faciale pour une précision maximale
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Résultat de l'analyse */}
      {currentResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">{getEmotionIcon(currentResult.emotion)}</span>
                  Résultat d'Analyse
                </span>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {Math.round(currentResult.confidence * 100)}% confiance
                  </Badge>
                  <Badge variant="secondary">
                    {currentResult.source}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Émotion principale */}
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                  getEmotionColor(currentResult.emotion, currentResult.valence, currentResult.arousal)
                }`}>
                  {getEmotionIcon(currentResult.emotion)}
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold capitalize mb-1">
                    {currentResult.emotion}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Valence: {currentResult.valence > 0 ? '+' : ''}{(currentResult.valence).toFixed(2)} • 
                    Arousal: {(currentResult.arousal).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Métriques */}
              {currentResult.metrics && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Heart className="h-4 w-4 mx-auto mb-1 text-red-500" />
                    <div className="font-semibold">{Math.round(currentResult.metrics.heartRate || 0)}</div>
                    <div className="text-xs text-muted-foreground">BPM</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <AlertCircle className="h-4 w-4 mx-auto mb-1 text-orange-500" />
                    <div className="font-semibold">{Math.round((currentResult.metrics.stressLevel || 0) * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Stress</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-500" />
                    <div className="font-semibold">{Math.round((currentResult.metrics.energyLevel || 0) * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Énergie</div>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Recommandations personnalisées:
                </h4>
                <ul className="space-y-2">
                  {currentResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Historique */}
      {showHistory && analysisHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Historique des analyses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysisHistory.slice(0, 5).map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getEmotionIcon(result.emotion)}</span>
                    <div>
                      <div className="font-medium capitalize">{result.emotion}</div>
                      <div className="text-xs text-muted-foreground">
                        {result.timestamp.toLocaleTimeString()} • {result.source}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(result.confidence * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmotionAnalysisEngine;